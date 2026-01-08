import Hero from './components/Hero';
import VisualGenerator from './components/VisualGenerator';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <VisualGenerator />
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            Vodun Days - Célébration de notre identité et de notre culture
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
