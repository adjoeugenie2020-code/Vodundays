export interface VisualOptions {
  photo: string;
  customText: string;
  theme: 'green' | 'red';
}

const CANVAS_SIZE = 1080;
const THEMES = {
  green: { background: '#1da78f', accentLight: '#2bc9ad', accentDark: '#159078', chainColor: '#f4c430' },
  red: { background: '#cc1837', accentLight: '#e6415e', accentDark: '#a81329', chainColor: '#f4c430' },
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
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
  ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(endX, endY); ctx.stroke();
  ctx.setLineDash([]);
  for (let i = 0; i <= numBeads; i++) {
    const t = i / numBeads;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export async function generateVisual(options: VisualOptions): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Context error');

  const theme = THEMES[options.theme];
  const centerX = CANVAS_SIZE / 2;
  const centerY = CANVAS_SIZE / 2 - 80; // Ajustement pour laisser de la place au bloc bas

  // 1. FOND
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 800);
  grad.addColorStop(0, `${theme.accentLight}50`);
  grad.addColorStop(1, `${theme.accentDark}20`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2. CHARGEMENT
  const [logoImg, userImg] = await Promise.all([
    loadImage('/vodun-days.png'),
    loadImage(options.photo),
  ]);

  // 3. DÉCORS
  drawDecorativeChain(ctx, 180, 50, 160, 550, theme.chainColor);
  drawDecorativeChain(ctx, CANVAS_SIZE - 180, 50, CANVAS_SIZE - 200, 450, theme.chainColor);

  // 4. PHOTO CIRCULAIRE
  const radius = 290;
  ctx.save();
  ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.clip();
  const aspect = userImg.width / userImg.height;
  let dW = radius * 2, dH = radius * 2;
  if (aspect > 1) dW = dH * aspect; else dH = dW / aspect;
  ctx.drawImage(userImg, centerX - dW/2, centerY - dH/2, dW, dH);
  ctx.restore();

  // Bordure dorée
  ctx.strokeStyle = '#f4c430';
  ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.stroke();

  // 5. TITRE HAUT
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 50px "Chantal Medium", sans-serif'; // Application de la police Chantal
  ctx.textAlign = 'center';
  ctx.fillText('MON IDENTITÉ. MA CULTURE.', centerX, 110);

  // 6. BLOC BAS : LOGO GAUCHE ET TEXTE DROITE
  const footerY = CANVAS_SIZE - 180;
  const margin = 80;

  // Logo
  const logoW = 280;
  const logoH = (logoImg.height / logoImg.width) * logoW;
  ctx.drawImage(logoImg, margin, footerY - logoH/2, logoW, logoH);

  // --- CONFIGURATION TEXTE CHANTAL MEDIUM ---
  const slogan = (options.customText || "MA CULTURE EST MA FORCE").toUpperCase();
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f4c430'; // Conservé en jaune pour la visibilité, change en #000000 si tu veux strictement du noir
  
  // Utilisation des propriétés demandées (Scale up proportionnel pour Canvas 1080px)
  // 20px en web équivaut environ à 60-70px sur un canvas de 1080px
  const fontSize = 65; 
  ctx.font = `500 ${fontSize}px "Chantal Medium", sans-serif`;
  
  const words = slogan.split(' ');
  let line = '';
  const lines = [];
  const maxWidth = 550;

  for(let word of words) {
    if (ctx.measureText(line + word).width > maxWidth) {
      lines.push(line.trim()); line = word + ' ';
    } else line += word + ' ';
  }
  lines.push(line.trim());

  // Line Height proportionnel (26px pour 20px font -> ratio 1.3)
  const lineHeight = fontSize * 1.3; 
  const startTextY = footerY - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((l, i) => {
    ctx.fillText(l, CANVAS_SIZE - margin, startTextY + (i * lineHeight));
  });

  // 7. SIGNATURE
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px "Chantal Medium", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DESIGNÉ PAR TCB', centerX, CANVAS_SIZE - 40);

  return canvas.toDataURL('image/png', 0.95);
}