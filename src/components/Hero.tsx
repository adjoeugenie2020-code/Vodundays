import React from 'react';

export default function VodunDaysHero() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      
      {/* Header / Logo Section */}
      <header className="pt-12 pb-8 flex justify-center">
        <img 
          src="vodun-days.png" 
          alt="Vodun Days Logo" 
          className="h-20 md:h-28 w-auto transition-transform duration-500 hover:scale-105"
        />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge de catégorie */}
          <div className="flex justify-center mb-8">
            <span className="h-px w-12 bg-amber-500 self-center"></span>
            <span className="mx-4 text-xs font-black tracking-[0.3em] uppercase text-amber-600">
              Patrimoine Vivant
            </span>
            <span className="h-px w-12 bg-amber-500 self-center"></span>
          </div>

          {/* Titre Principal */}
          <h1 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-none text-slate-900">
            MON IDENTITÉ.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-amber-800 to-slate-900">
              MA CULTURE.
            </span>
          </h1>

          {/* Description */}
          <div className="relative">
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
              Célébrez votre héritage culturel et exprimez votre identité à travers un visuel unique. 
              Un hommage à la richesse de notre patrimoine et à la fierté de nos racines.
            </p>
            
            {/* Décoration subtile en bas de texte */}
            <div className="mt-12 flex justify-center space-x-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Signature */}
      <footer className="py-12 border-t border-slate-50">
        <div className="max-w-5xl mx-auto px-8 flex flex-col items-center">
          <div className="flex items-center space-x-3 group">
            <span className="text-slate-400 text-sm tracking-widest uppercase">Design conçu par</span>
            <span className="h-px w-6 bg-slate-200 group-hover:w-10 transition-all duration-300"></span>
            <span className="text-slate-900 font-bold tracking-tight">
              Rénato TCHOBO
            </span>
          </div>
          <p className="mt-4 text-[10px] text-slate-300 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} — Tous droits réservés
          </p>
        </div>
      </footer>

    </div>
  );
}