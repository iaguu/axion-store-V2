import { Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  const handleAdminAccess = () => {
    // Redireciona para página de login admin
    navigate('/admin')
  }

  return (
    <footer className="bg-black border-t border-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-black border-2 border-white rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">&gt;</span>
              </div>
              <span className="text-lg font-bold">AXION<span className="font-light">STORE</span></span>
            </div>
            <p className="text-gray-400 text-sm">O universo digital em um só lugar</p>
          </div>

          {/* Produtos */}
          <div>
            <h4 className="font-bold mb-4">Produtos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => window.open('https://axionstore.com/cards', '_blank')} className="hover:text-white transition-colors">Cards Marketplace</button></li>
              <li><button onClick={() => window.open('https://axionstore.com/database', '_blank')} className="hover:text-white transition-colors">Database Search</button></li>
              <li><button onClick={() => window.open('https://axionstore.com/black', '_blank')} className="hover:text-white transition-colors">Black Development</button></li>
              <li><button onClick={() => window.open('https://axionstore.com/bots', '_blank')} className="hover:text-white transition-colors">Bots & Automação</button></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-bold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => window.open('https://axionstore.com/about', '_blank')} className="hover:text-white transition-colors">Sobre Nós</button></li>
              <li><button onClick={() => window.open('https://blog.axionstore.com', '_blank')} className="hover:text-white transition-colors">Blog</button></li>
              <li><button onClick={() => window.open('https://axionstore.com/contact', '_blank')} className="hover:text-white transition-colors">Contato</button></li>
              <li><button onClick={() => window.open('https://axionstore.com/careers', '_blank')} className="hover:text-white transition-colors">Carreiras</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => window.open('https://axionstore.com/privacy', '_blank')} className="hover:text-white transition-colors">Privacidade</button></li>
              <li><button onClick={() => window.open('https://axionstore.com/terms', '_blank')} className="hover:text-white transition-colors">Termos de Uso</button></li>
              <li><button onClick={() => window.open('https://axionstore.com/cookies', '_blank')} className="hover:text-white transition-colors">Cookies</button></li>
              <li><button onClick={() => window.open('https://axionstore.com/compliance', '_blank')} className="hover:text-white transition-colors">Compliance</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-900 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 AXION STORE. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 sm:mt-0 items-center">
              <button 
                onClick={() => window.open('https://twitter.com/axionstore', '_blank')}
                className="hover:text-white transition-colors"
              >
                Twitter
              </button>
              <button 
                onClick={() => window.open('https://discord.gg/axionstore', '_blank')}
                className="hover:text-white transition-colors"
              >
                Discord
              </button>
              <button 
                onClick={() => window.open('https://t.me/axionstore', '_blank')}
                className="hover:text-white transition-colors"
              >
                Telegram
              </button>
              <button
                onClick={handleAdminAccess}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                title="Acesso Administrativo"
              >
                <Crown size={16} />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
