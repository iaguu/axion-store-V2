import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    if (!agreedTerms) {
      alert('Você precisa aceitar os termos de uso!')
      return
    }

    setIsLoading(true)
    
    // Simulação de cadastro
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        plan: 'free'
      }))
      navigate('/dashboard')
      setIsLoading(false)
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black border-2 border-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">&gt;</span>
          </div>
          <h1 className="text-3xl font-bold">AXION<span className="font-light">STORE</span></h1>
          <p className="text-gray-400 mt-2">Crie sua conta gratuita</p>
        </div>

        {/* Register Form */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Nome Completo</label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Senha</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Confirmar Senha</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500 mt-1"
              />
              <label htmlFor="terms" className="text-gray-300 text-sm">
                Eu concordo com os{' '}
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                  Política de Privacidade
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreedTerms}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Criar Conta
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <a href="/login" className="text-green-400 hover:text-green-300 transition-colors font-semibold">
                Faça login
              </a>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Check size={16} className="text-green-400" />
              <span>10 Cards grátis no plano Free</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Check size={16} className="text-green-400" />
              <span>Acesso ao Database básico</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Check size={16} className="text-green-400" />
              <span>Suporte comunitário</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
