export interface VisualOptions {
  photo: string;
  customText: string;
  theme: 'green' | 'red';
}

const CANVAS_SIZE = 1080;
const THEMES = {
  green: {
    background: '#1da78f',
    accentLight: '#2bc9ad',
    accentDark: '#159078',
    chainColor: '#f4c430',
  },
  red: {
    background: '#cc1837',
    accentLight: '#e6415e',
    accentDark: '#a81329',
    chainColor: '#f4c430',
  },
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Impossible de charger l'image : ${src}`));
    img.src = src;
  });
}

function drawDecorativeChain(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, color: string) {
  const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const numBeads = Math.floor(distance / 20);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 10]);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.setLineDash([]);
  for (let i = 0; i <= numBeads; i++) {
    const t = i / numBeads;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCowries(ctx: CanvasRenderingContext2D, cowrieImg: HTMLImageElement) {
  const positions = [
    { x: 80, y: 250, rotation: -20, scale: 1 },
    { x: 60, y: 340, rotation: 10, scale: 0.8 },
    { x: 100, y: 430, rotation: -30, scale: 0.9 },
    { x: CANVAS_SIZE - 120, y: 80, rotation: 30, scale: 1 },
    { x: CANVAS_SIZE - 100, y: 170, rotation: -15, scale: 0.85 },
    { x: CANVAS_SIZE - 150, y: 900, rotation: 20, scale: 0.9 },
    { x: CANVAS_SIZE - 80, y: 980, rotation: -25, scale: 0.85 },
  ];
  positions.forEach((pos) => {
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate((pos.rotation * Math.PI) / 180);
    ctx.globalAlpha = 0.3;
    const size = 80 * pos.scale;
    ctx.drawImage(cowrieImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  });
}

export async function generateVisual(options: VisualOptions): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const theme = THEMES[options.theme];
  const centerX = CANVAS_SIZE / 2;
  const centerY = CANVAS_SIZE / 2 - 50; // Remonté pour libérer l'espace texte

  // 1. FOND
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, CANVAS_SIZE / 1.5);
  gradient.addColorStop(0, `${theme.accentLight}40`);
  gradient.addColorStop(1, `${theme.accentDark}40`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2. CHARGEMENT ASSETS
  const [cowrieImg, logoImg, userImg] = await Promise.all([
    loadImage('/istockphoto-928866460-612x612-removebg-preview.png'),
    loadImage('/vodun-days.png'),
    loadImage(options.photo),
  ]);

  // 3. DÉCORS
  drawCowries(ctx, cowrieImg);
  drawDecorativeChain(ctx, 200, 50, 150, 600, theme.chainColor);
  drawDecorativeChain(ctx, CANVAS_SIZE - 200, 100, CANVAS_SIZE - 150, 550, theme.chainColor);

  // 4. CERCLE PHOTO
  const circleRadius = 280;
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.clip();
  const imgAspect = userImg.width / userImg.height;
  let dW = circleRadius * 2, dH = circleRadius * 2, oX = 0, oY = 0;
  if (imgAspect > 1) { dW = (circleRadius * 2) * imgAspect; oX = -(dW - (circleRadius * 2)) / 2; } 
  else { dH = (circleRadius * 2) / imgAspect; oY = -(dH - (circleRadius * 2)) / 2; }
  ctx.drawImage(userImg, centerX - circleRadius + oX, centerY - circleRadius + oY, dW, dH);
  ctx.restore();

  // Bordure
  ctx.strokeStyle = '#f4c430';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 5. TITRE HAUT
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 55px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MON IDENTITÉ. MA CULTURE.', centerX, 110);

  // 6. POSITIONNEMENT BAS (LOGO GAUCHE / TEXTE DROITE)
  const margin = 60;
  const logoWidth = 260;
  const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
  const bottomY = CANVAS_SIZE - margin - 40; // Point de base pour l'alignement
  
  // Dessin du Logo
  ctx.drawImage(logoImg, margin, bottomY - logoHeight, logoWidth, logoHeight);

  // 7. TEXTE PERSONNALISÉ (Zone sécurisée à droite)
  const slogan = (options.customText.trim() || "MA CULTURE EST MA FORCE").toUpperCase();
  const textZoneXStart = margin + logoWidth + 40; // Sécurité après le logo
  const textMaxAvailableWidth = CANVAS_SIZE - textZoneXStart - margin;

  // Ajustement auto de la taille
  let fontSize = 65;
  if (slogan.length > 25) fontSize = 52;
  if (slogan.length > 45) fontSize = 42;

  ctx.fillStyle = '#f4c430';
  ctx.font = `900 ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'right';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 8;

  const words = slogan.split(' ');
  let line = '';
  let lines: string[] = [];

  for (const word of words) {
    let testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > textMaxAvailableWidth) {
      lines.push(line.trim());
      line = word + ' ';
    } else { line = testLine; }
  }
  lines.push(line.trim());

  // Calcul du point de départ vertical pour que le texte finisse au niveau du bas du logo
  const lineHeight = fontSize * 1.1;
  const totalTextHeight = lines.length * lineHeight;
  let textY = bottomY - totalTextHeight + fontSize;

  lines.forEach((textLine, index) => {
    ctx.fillText(textLine, CANVAS_SIZE - margin, textY + (index * lineHeight));
  });

  // 8. SIGNATURE
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('DESIGNÉ PAR TCB', centerX, CANVAS_SIZE - 25);
  ctx.restore();

  return canvas.toDataURL('image/png', 0.9);
}