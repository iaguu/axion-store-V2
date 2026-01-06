import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulação de login
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify({
        id: 'demo_user_123', // ID fixo para consistência
        name: 'Usuário Demo',
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black border-2 border-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">&gt;</span>
          </div>
          <h1 className="text-3xl font-bold">AXION<span className="font-light">STORE</span></h1>
          <p className="text-gray-400 mt-2">Entre na sua conta</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500" />
                <span className="text-gray-300 text-sm">Lembrar-me</span>
              </label>
              <a href="#" className="text-green-400 text-sm hover:text-green-300 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Não tem uma conta?{' '}
              <a href="/register" className="text-green-400 hover:text-green-300 transition-colors font-semibold">
                Cadastre-se
              </a>
            </p>
          </div>

          {/* Demo Account */}
          <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
            <p className="text-gray-400 text-sm mb-2">Conta Demo:</p>
            <p className="text-gray-300 text-sm">Email: demo@axionstore.com</p>
            <p className="text-gray-300 text-sm">Senha: demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
