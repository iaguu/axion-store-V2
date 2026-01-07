import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Database, 
  Bot, 
  Cpu, 
  Server, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Crown,
  Globe,
  Package,
  RefreshCw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Catalog from './Catalog'
import Checkout from './Checkout'
import QuickCheckout from './QuickCheckout'
import { getProductsByCategory } from '../data/products'
import dashboardService from '../services/dashboardService'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [useQuickCheckout, setUseQuickCheckout] = useState(true)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  
  // Estados para dados dinâmicos
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [userCards, setUserCards] = useState([])
  const [userBots, setUserBots] = useState([])
  const [userTransactions, setUserTransactions] = useState([])
  const [userQueries, setUserQueries] = useState([])
  
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Carregar dados da dashboard
      loadDashboardData(parsedUser.id)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handlePurchase = (product) => {
    setSelectedProduct(product)
    setShowCheckout(true)
  }

  const handleCheckoutSuccess = (paymentData) => {
    console.log('Pagamento realizado:', paymentData)
    setShowCheckout(false)
    setSelectedProduct(null)
  }

  // Função para carregar dados dinâmicos
  const loadDashboardData = async (userId) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Carregando dados da dashboard para usuário:', userId)
      
      // Carregar estatísticas
      const userStats = await dashboardService.getUserStats(userId)
      console.log('Estatísticas carregadas:', userStats)
      setStats(userStats)
      
      // Carregar atividades recentes
      const activities = await dashboardService.getRecentActivities(userId)
      console.log('Atividades carregadas:', activities)
      setRecentActivity(activities)
      
      // Carregar cards do usuário
      const cards = await dashboardService.getUserCards(userId)
      console.log('Cards carregados:', cards)
      setUserCards(cards)
      
      // Carregar bots do usuário
      const bots = await dashboardService.getUserBots(userId)
      console.log('Bots carregados:', bots)
      setUserBots(bots)
      
      // Carregar transações
      const transactions = await dashboardService.getUserTransactions(userId)
      console.log('Transações carregadas:', transactions)
      setUserTransactions(transactions)
      
      // Carregar consultas
      const queries = await dashboardService.getUserQueries(userId)
      console.log('Consultas carregadas:', queries)
      setUserQueries(queries)
      
      // Se não houver dados, inicializar dados de exemplo
      if (!userStats || userStats.totalTransactions === 0) {
        console.log('Inicializando dados de exemplo...')
        await dashboardService.initializeSampleData(userId)
        await loadDashboardData(userId) // Recarregar após inicialização
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados da dashboard:', error)
      setError('Não foi possível carregar seus dados. Tente recarregar a página.')
      
      // Definir valores padrão para evitar quebra da UI
      setStats({
        totalTransactions: 0,
        totalCards: 0,
        totalBots: 0,
        totalQueries: 0,
        monthlyRevenue: 0,
        activeSubscriptions: 0
      })
      setRecentActivity([])
      setUserCards([])
      setUserBots([])
      setUserTransactions([])
      setUserQueries([])
      
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Função para atualizar dados
  const refreshData = () => {
    if (user) {
      setRefreshing(true)
      setError(null) // Limpar erro ao tentar novamente
      dashboardService.clearCache()
      loadDashboardData(user.id)
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'catalog', label: 'Catálogo', icon: ShoppingBag },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'bots', label: 'Bots', icon: Bot },
    { id: 'consultas', label: 'Consultas', icon: Database },
    { id: 'vip', label: 'VIP Premium', icon: Crown },
    { id: 'tools', label: 'Ferramentas', icon: Globe },
    { id: 'ia', label: 'IA Tools', icon: Cpu },
    { id: 'server', label: 'Servidor', icon: Server },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ]

  const handleGoToAffiliate = () => {
    navigate('/affiliate')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black border-2 border-white rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">&gt;</span>
                </div>
                <span className="text-lg font-bold">AXION<span className="font-light">STORE</span></span>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-64"
                />
              </div>

              <button 
                onClick={handleGoToAffiliate}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                <DollarSign size={18} className="text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">Painel Afiliado</span>
              </button>

              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.plan}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{user.name.charAt(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900/50 border-r border-gray-800 transition-transform duration-300 mt-16 lg:mt-0 flex flex-col`}>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
                  <p className="text-gray-400">Bem-vindo de volta, {user?.name}!</p>
                </div>
                
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                  <span>Atualizar</span>
                </button>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-3" />
                  <span className="text-gray-400">Carregando dados...</span>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
                  <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Erro ao Carregar Dados</h3>
                  <p className="text-gray-400 mb-4">{error}</p>
                  <button
                    onClick={refreshData}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && stats && stats.totalTransactions === 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                  <Package size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Bem-vindo à Axion Store!</h3>
                  <p className="text-gray-400 mb-6">
                    Sua conta está pronta para uso. Comece explorando nossos produtos e serviços.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      Explorar Catálogo
                    </button>
                    <button
                      onClick={() => setActiveTab('vip')}
                      className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                    >
                      Ver Planos VIP
                    </button>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              {!loading && !error && stats && stats.totalTransactions > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      label: 'Cards Ativos',
                      value: (stats.cardsActive || 0).toString(),
                      change: (stats.cardsActive || 0) > 0 ? '+12%' : '0%',
                      icon: CreditCard,
                      color: 'from-green-500 to-green-600'
                    },
                    {
                      label: 'Receita Mensal',
                      value: `R$ ${(stats.monthlyRevenue || 0).toFixed(2)}`,
                      change: (stats.monthlyRevenue || 0) > 0 ? '+23%' : '0%',
                      icon: DollarSign,
                      color: 'from-blue-500 to-blue-600'
                    },
                    {
                      label: 'Taxa Sucesso',
                      value: `${stats.successRate || 0}%`,
                      change: (stats.successRate || 0) > 0 ? '+2%' : '0%',
                      icon: CheckCircle,
                      color: 'from-purple-500 to-purple-600'
                    },
                    {
                      label: 'Operações/hora',
                      value: stats.operationsPerHour || 0,
                      change: (stats.operationsPerHour || 0) > 0 ? '+5%' : '0%',
                      icon: Activity,
                      color: 'from-orange-500 to-orange-600'
                    }
                  ].map((stat, index) => {
                    const Icon = stat.icon
                    const isPositive = stat.change.startsWith('+')
                    return (
                      <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                            <Icon size={24} className="text-white" />
                          </div>
                          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            <span>{stat.change}</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-gray-400 text-sm">{stat.label}</div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Recent Activity */}
              {!loading && recentActivity.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Atividade Recente</h2>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-xl">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                          activity.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          activity.status === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {activity.status === 'success' ? <CheckCircle size={20} /> :
                           activity.status === 'warning' ? <AlertCircle size={20} /> :
                           activity.status === 'error' ? <AlertCircle size={20} /> :
                           <Clock size={20} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{activity.description}</p>
                          <p className="text-gray-400 text-sm">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('cards')}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all text-left"
                >
                  <CreditCard size={24} className="text-green-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">Novo Card</h3>
                  <p className="text-gray-400 text-sm">Adicionar novo card</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('consultas')}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all text-left"
                >
                  <Database size={24} className="text-blue-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">Consultar DB</h3>
                  <p className="text-gray-400 text-sm">Buscar dados</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('bots')}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all text-left"
                >
                  <Bot size={24} className="text-purple-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">Executar Bot</h3>
                  <p className="text-gray-400 text-sm">Iniciar automação</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all text-left"
                >
                  <Settings size={24} className="text-gray-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">Configurações</h3>
                  <p className="text-gray-400 text-sm">Ajustar sistema</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Cards Marketplace</h1>
                <p className="text-gray-400">Gerencie seus cards de forma segura e rápida</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Seus Cards</h2>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                    Adicionar Card
                  </button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-3" />
                    <span className="text-gray-400">Carregando cards...</span>
                  </div>
                ) : userCards.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhum card encontrado</h3>
                    <p className="text-gray-400 mb-4">Adicione seu primeiro card para começar</p>
                    <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                      Adicionar Card
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userCards.map((card) => (
                      <div key={card.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              card.status === 'active' ? 'bg-green-500/20' : 'bg-gray-500/20'
                            }`}>
                              <CreditCard size={24} className={
                                card.status === 'active' ? 'text-green-400' : 'text-gray-400'
                              } />
                            </div>
                            <div>
                              <p className="text-white font-medium">{card.number}</p>
                              <p className="text-gray-400 text-sm">
                                Limite: R$ {card.limit.toLocaleString('pt-BR')} • 
                                Usado: R$ {card.used.toLocaleString('pt-BR')} • 
                                Status: {card.status === 'active' ? 'Ativo' : 'Inativo'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              card.status === 'active' 
                                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                : 'bg-gray-500/20 border border-gray-500/50 text-gray-400'
                            }`}>
                              {card.status === 'active' ? 'Live' : 'Offline'}
                            </span>
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                              <Settings size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'catalog' && <Catalog />}

          {activeTab === 'bots' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Bots & Automação</h1>
                <p className="text-gray-400">Automações inteligentes para maximizar sua produtividade</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getProductsByCategory('bots').map(product => (
                  <div key={product.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4`}>
                      <product.icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                    <div className="text-2xl font-bold text-green-400 mb-4">
                      R$ {product.price.toFixed(2)}
                    </div>
                    <button 
                      onClick={() => handlePurchase(product)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      Comprar Agora
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'consultas' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Consultas Database</h1>
                <p className="text-gray-400">Acesso instantâneo a informações privilegiadas</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getProductsByCategory('consultas').map(product => (
                  <div key={product.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4`}>
                      <product.icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                    <div className="text-2xl font-bold text-blue-400 mb-4">
                      R$ {product.price.toFixed(2)}
                    </div>
                    <button 
                      onClick={() => handlePurchase(product)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                      Consultar Agora
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vip' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">VIP Premium</h1>
                <p className="text-gray-400">Acesso exclusivo aos melhores serviços e benefícios</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getProductsByCategory('vip').map(product => (
                  <div key={product.id} className={`bg-gray-900/50 border ${product.popular ? 'border-yellow-500' : 'border-gray-800'} rounded-2xl p-6 hover:border-gray-700 transition-all relative`}>
                    {product.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                          MAIS POPULAR
                        </span>
                      </div>
                    )}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4`}>
                      <product.icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                    <div className="text-3xl font-bold text-yellow-400 mb-4">
                      R$ {product.price.toFixed(2)}
                      <span className="text-sm text-gray-400">/mês</span>
                    </div>
                    <button 
                      onClick={() => handlePurchase(product)}
                      className={`w-full py-2 rounded-lg font-semibold transition-all ${
                        product.popular 
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700' 
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                      }`}
                    >
                      Assinar Agora
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Ferramentas Premium</h1>
                <p className="text-gray-400">Tools e utilitários para potencializar suas operações</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getProductsByCategory('tools').map(product => (
                  <div key={product.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4`}>
                      <product.icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                    <div className="text-2xl font-bold text-orange-400 mb-4">
                      R$ {product.price.toFixed(2)}
                    </div>
                    <button 
                      onClick={() => handlePurchase(product)}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                    >
                      Ativar Agora
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">IA Tools</h1>
                <p className="text-gray-400">Modelos de inteligência artificial de última geração</p>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3">
                      <Cpu size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">GPT-4 Turbo</h3>
                    <p className="text-gray-400 text-sm mb-3">Modelo mais avançado para tarefas complexas</p>
                    <div className="text-xl font-bold text-purple-400 mb-3">R$ 0.05/token</div>
                    <button 
                      onClick={() => handlePurchase({
                        id: 'gpt4-turbo',
                        name: 'GPT-4 Turbo',
                        description: 'Modelo mais avançado para tarefas complexas',
                        price: 0.05,
                        color: 'from-purple-500 to-purple-600',
                        icon: Cpu
                      })}
                      className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                    >
                      Usar Agora
                    </button>
                  </div>
                  
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
                      <Cpu size={24} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Claude 3 Opus</h3>
                    <p className="text-gray-400 text-sm mb-3">Análise crítica e raciocínio superior</p>
                    <div className="text-xl font-bold text-blue-400 mb-3">R$ 0.07/token</div>
                    <button 
                      onClick={() => handlePurchase({
                        id: 'claude3-opus',
                        name: 'Claude 3 Opus',
                        description: 'Análise crítica e raciocínio superior',
                        price: 0.07,
                        color: 'from-blue-500 to-blue-600',
                        icon: Cpu
                      })}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Usar Agora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'server' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Infraestrutura</h1>
                <p className="text-gray-400">Servidores dedicados e soluções cloud</p>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'VPS Básico', cpu: '2 vCPU', ram: '4GB', storage: '80GB SSD', price: 97, id: 'vps-basic' },
                    { name: 'VPS Pro', cpu: '4 vCPU', ram: '8GB', storage: '160GB SSD', price: 197, id: 'vps-pro' },
                    { name: 'Dedicated', cpu: '8 vCPU', ram: '16GB', storage: '320GB SSD', price: 397, id: 'dedicated' }
                  ].map((server, index) => (
                    <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-3">
                        <Server size={24} className="text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{server.name}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">CPU:</span>
                          <span className="text-white">{server.cpu}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">RAM:</span>
                          <span className="text-white">{server.ram}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Storage:</span>
                          <span className="text-white">{server.storage}</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-cyan-400 mb-3">
                        R$ {server.price}/mês
                      </div>
                      <button 
                        onClick={() => handlePurchase({
                          id: server.id,
                          name: server.name,
                          description: `Servidor ${server.name} - ${server.cpu}, ${server.ram}, ${server.storage}`,
                          price: server.price,
                          color: 'from-cyan-500 to-cyan-600',
                          icon: Server
                        })}
                        className="w-full bg-cyan-500 text-white py-2 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                      >
                        Alugar Agora
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Configurações</h1>
                <p className="text-gray-400">Gerencie sua conta e preferências</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Perfil</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Nome</label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Plano Atual</label>
                    <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl">
                      <span className="text-green-400 font-medium capitalize">{user.plan}</span>
                    </div>
                  </div>
                </div>

                <button className="mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all">
                  Fazer Upgrade para Pro
                </button>
              </div>
            </div>
          )}

          {/* Checkout Modal */}
          {showCheckout && selectedProduct && (
            useQuickCheckout ? (
              <QuickCheckout
                product={selectedProduct}
                onClose={() => {
                  setShowCheckout(false)
                  setSelectedProduct(null)
                }}
                onSuccess={handleCheckoutSuccess}
              />
            ) : (
              <Checkout
                product={selectedProduct}
                onClose={() => {
                  setShowCheckout(false)
                  setSelectedProduct(null)
                }}
                onSuccess={handleCheckoutSuccess}
              />
            )
          )}
        </main>
      </div>
    </div>
  )
}
