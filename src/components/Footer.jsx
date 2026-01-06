import { Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  const handleAdminAccess = () => {
    // Simula acesso admin (em produção, verificaria permissões reais)
    localStorage.setItem('isAdmin', 'true')
    localStorage.setItem('admin', JSON.stringify({
      name: 'Admin User',
      email: 'admin@axionstore.com',
      role: 'administrator'
    }))
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
              <li><a href="#" className="hover:text-white transition-colors">Cards Marketplace</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Database Search</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Black Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bots & Automação</a></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-bold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-900 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 AXION STORE. Todos os direitos reservados.</p>
            <div className="flex gap-6 mt-4 sm:mt-0 items-center">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">Telegram</a>
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
