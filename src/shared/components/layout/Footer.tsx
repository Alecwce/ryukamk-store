import { Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dragon-black border-t border-dragon-fire/20 text-dragon-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🐉</div>
              <div>
                <div className="font-display font-bold text-xl bg-dragon-gradient bg-clip-text text-transparent">
                  RYŪKAMI
                </div>
                <div className="text-xs text-dragon-cyan">龍神</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Streetwear japonés de alta calidad. Despierta al dragón que llevas dentro.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold mb-4 text-dragon-fire">TIENDA</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-dragon-cyan transition-colors">Productos</a></li>
              <li><a href="#" className="hover:text-dragon-cyan transition-colors">Novedades</a></li>
              <li><a href="#" className="hover:text-dragon-cyan transition-colors">Ofertas</a></li>
              <li><a href="#" className="hover:text-dragon-cyan transition-colors">Colecciones</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold mb-4 text-dragon-fire">AYUDA</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-dragon-cyan transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-dragon-cyan transition-colors">Envíos</a></li>
              <li><a href="#" className="hover:text-dragon-cyan transition-colors">Cambios</a></li>
              <li><a href="#" className="hover:text-dragon-cyan transition-colors">Guía de Tallas</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold mb-4 text-dragon-fire">SÍGUENOS</h3>
            <div className="flex gap-4 mb-4">
              <a
                href="https://tiktok.com/@ryukami.store"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-dragon-fire/10 hover:bg-dragon-fire/20 p-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/ryukami.store"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-dragon-fire/10 hover:bg-dragon-fire/20 p-3 rounded-lg transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/51999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-dragon-fire/10 hover:bg-dragon-fire/20 p-3 rounded-lg transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              📱 Únete a #RyukamiPeru
            </p>
          </div>
        </div>

        <div className="border-t border-dragon-fire/20 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 RYŪKAMI - Hecho con 🔥 en Perú</p>
          <p className="mt-2">
            <a href="#" className="hover:text-dragon-cyan transition-colors">Términos</a>
            {' · '}
            <a href="#" className="hover:text-dragon-cyan transition-colors">Privacidad</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
