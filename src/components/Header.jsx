import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header({ mobileMenuOpen, setMobileMenuOpen }) {
  const navigate = useNavigate()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const handleGetStarted = () => {
    navigate('/register')
  }
  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-sm border-b border-gray-900 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black border-2 border-white rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">&gt;</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">AXION<span className="font-light">STORE</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <button onClick={() => scrollToSection('services')} className="hover:text-green-400 transition-colors">Serviços</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-green-400 transition-colors">Preços</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-green-400 transition-colors">Prova Social</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-green-400 transition-colors">Contato</button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="hidden sm:block text-gray-300 hover:text-white transition-colors"
            >
              Entrar
            </button>
            
            {/* CTA Button */}
            <button 
              onClick={handleGetStarted}
              className="hidden sm:block bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105"
            >
              Começar Agora
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-900">
            <nav className="flex flex-col gap-4 pt-4">
              <button onClick={() => scrollToSection('services')} className="hover:text-green-400 transition-colors text-left">Serviços</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-green-400 transition-colors text-left">Preços</button>
              <button onClick={() => scrollToSection('testimonials')} className="hover:text-green-400 transition-colors text-left">Prova Social</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-green-400 transition-colors text-left">Contato</button>
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Entrar
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all w-full"
              >
                Começar Agora
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
