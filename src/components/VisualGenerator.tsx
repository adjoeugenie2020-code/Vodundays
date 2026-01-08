import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Eye, Share2 } from 'lucide-react';
import { generateVisual, type VisualOptions } from '../utils/canvasGenerator';

export default function VisualGenerator() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [customText, setCustomText] = useState('Ma culture est ma force');
  const [theme, setTheme] = useState<'green' | 'red'>('green');
  const [accepted, setAccepted] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Veuillez sélectionner une image au format JPG ou PNG');
    }
  };

  const handleGenerate = async () => {
    if (!photo) {
      alert('Veuillez uploader une photo');
      return;
    }
    if (!accepted) {
      alert('Veuillez accepter les conditions');
      return;
    }

    setIsGenerating(true);
    try {
      const options: VisualOptions = {
        photo,
        customText,
        theme,
      };
      const result = await generateVisual(options);
      setGeneratedImage(result);
      setShowPreview(false);
    } catch (error) {
      console.error('Error generating visual:', error);
      alert('Une erreur est survenue lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = () => {
    if (!photo) {
      alert('Veuillez uploader une photo');
      return;
    }
    setShowPreview(true);
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.download = `vodun-days-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  };

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'instagram') => {
    if (!generatedImage) {
      alert('Veuillez d\'abord générer votre visuel');
      return;
    }

    const text = encodeURIComponent('Mon identité. Ma culture. #VodunDays');

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
        break;
      case 'instagram':
        alert('Pour partager sur Instagram, veuillez télécharger l\'image et la publier depuis votre application mobile');
        break;
    }
  };

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Votre Photo
              </label>
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">
                    {photo ? 'Changer la photo' : 'Uploader une photo'}
                  </span>
                </button>

                {photo && (
                  <div className="relative w-48 h-48 mx-auto">
                    <img
                      src={photo}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full border-4 border-gray-200 shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Votre Message Personnel (max 60 caractères)
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value.slice(0, 60))}
                placeholder="Ma culture est ma force"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                {customText.length}/60 caractères
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choisir un Thème
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('green')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    theme === 'green'
                      ? 'border-[#1da78f] bg-[#1da78f]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#1da78f] mx-auto mb-3"></div>
                  <p className="font-semibold text-gray-900">Thème Vert</p>
                  <p className="text-xs text-gray-600 mt-1">Culture & Tradition</p>
                </button>

                <button
                  onClick={() => setTheme('red')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    theme === 'red'
                      ? 'border-[#cc1837] bg-[#cc1837]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#cc1837] mx-auto mb-3"></div>
                  <p className="font-semibold text-gray-900">Thème Rouge</p>
                  <p className="text-xs text-gray-600 mt-1">Identité & Héritage</p>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="accept"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
              />
              <label htmlFor="accept" className="text-sm text-gray-700 cursor-pointer">
                J'accepte que ce visuel soit une création artistique et culturelle
              </label>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={!photo || !accepted || isGenerating}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                {isGenerating ? 'Génération en cours...' : 'Générer mon visuel'}
              </button>

              <button
                onClick={handlePreview}
                disabled={!photo}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                <Eye className="w-5 h-5" />
                Visualiser avant de télécharger
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Aperçu du Visuel
              </label>
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-200 overflow-hidden">
                {generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated visual"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm font-medium">Votre visuel apparaîtra ici</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {generatedImage && (
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Télécharger le visuel
                </button>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                    Partager sur
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-medium rounded-lg hover:bg-[#20ba5a] transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white font-medium rounded-lg hover:bg-[#166fe5] transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('instagram')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Instagram</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showPreview && photo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Aperçu</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <div className={`w-full h-full ${theme === 'green' ? 'bg-[#1da78f]' : 'bg-[#cc1837]'} flex items-center justify-center relative`}>
                    <img
                      src={photo}
                      alt="Preview"
                      className="w-1/2 h-1/2 object-cover rounded-full border-8 border-yellow-400"
                    />
                    <div className="absolute top-8 left-0 right-0 text-center">
                      <p className="text-3xl font-bold text-black px-4">
                        MON IDENTITÉ. MA CULTURE.
                      </p>
                    </div>
                    {customText && (
                      <div className="absolute bottom-32 left-0 right-0 text-center">
                        <p className="text-2xl font-bold text-white px-8 drop-shadow-lg">
                          {customText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Ceci est un aperçu simplifié. Le visuel final sera de meilleure qualité avec tous les détails.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
