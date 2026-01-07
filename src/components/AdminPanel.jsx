import { useState, useEffect } from 'react'
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  Database, 
  TrendingUp, 
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Ban,
  Crown,
  Activity,
  Globe,
  Server,
  Zap,
  Clock,
  Filter,
  Search,
  Download,
  Upload,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import adminAuthService from '../services/adminAuthService'
import adminService from '../services/adminService'

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [admin, setAdmin] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Estados para dados dinâmicos
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [services, setServices] = useState([])
  const [securityAlerts, setSecurityAlerts] = useState(null)
  const [systemStatus, setSystemStatus] = useState(null)
  
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar autenticação admin
    if (!adminAuthService.checkAuth()) {
      navigate('/login')
      return
    }
    
    const adminUser = adminAuthService.user
    setAdmin(adminUser)
    
    // Carregar dados do painel
    loadAdminData()
  }, [navigate])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Carregar todos os dados em paralelo
      const [overviewData, usersData, transactionsData, servicesData, securityData, systemData] = await Promise.all([
        adminService.getOverview(),
        adminService.getUsers(),
        adminService.getTransactions(),
        adminService.getServices(),
        adminService.getSecurityAlerts(),
        adminService.getSystemStatus()
      ])
      
      setOverview(overviewData)
      setUsers(usersData)
      setTransactions(transactionsData)
      setServices(servicesData)
      setSecurityAlerts(securityData)
      setSystemStatus(systemData)
      
    } catch (error) {
      console.error('Erro ao carregar dados admin:', error)
      setError('Não foi possível carregar os dados administrativos')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    adminAuthService.logout()
    navigate('/')
  }

  const adminStats = overview ? [
    { label: 'Total Usuários', value: overview.totalUsers.toLocaleString(), change: `+${(overview.activeUsers/overview.totalUsers*100).toFixed(1)}%`, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Receita Mensal', value: `R$ ${overview.monthlyRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, change: '+32%', icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'Transações', value: overview.totalTransactions.toLocaleString(), change: '+24%', icon: CreditCard, color: 'from-purple-500 to-purple-600' },
    { label: 'Taxa Conversão', value: `${overview.conversionRate}%`, change: '+3%', icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
  ] : []

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Alta taxa de falha nos cards internacionais', time: '5 min atrás' },
    { id: 2, type: 'error', message: 'Servidor Database #2 sobrecarregado', time: '12 min atrás' },
    { id: 3, type: 'success', message: 'Backup automático concluído', time: '1 hora atrás' },
    { id: 4, type: 'info', message: 'Novo recorde de usuários simultâneos', time: '2 horas atrás' },
  ]

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'system', label: 'Sistema', icon: Server },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ]

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'view':
          console.log('View user:', userId)
          // Implementar modal de detalhes do usuário
          break
        case 'suspend':
          await adminService.updateUserStatus(userId, 'suspended')
          await loadAdminData()
          break
        case 'activate':
          await adminService.updateUserStatus(userId, 'active')
          await loadAdminData()
          break
        case 'block':
          await adminService.updateUserStatus(userId, 'blocked')
          await loadAdminData()
          break
        case 'upgrade':
          await adminService.updateUserPlan(userId, 'enterprise')
          await loadAdminData()
          break
        case 'delete':
          if (confirm('Tem certeza que deseja excluir este usuário?')) {
            await adminService.deleteUser(userId)
            await loadAdminData()
          }
          break
        default:
          console.log('Unknown action:', action, userId)
      }
    } catch (error) {
      console.error('Erro na ação do usuário:', error)
      alert('Erro ao executar ação. Tente novamente.')
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('Selecione pelo menos um usuário')
      return
    }

    try {
      switch (action) {
        case 'suspend':
          for (const userId of selectedUsers) {
            await adminService.updateUserStatus(userId, 'suspended')
          }
          break
        case 'activate':
          for (const userId of selectedUsers) {
            await adminService.updateUserStatus(userId, 'active')
          }
          break
        case 'delete':
          if (confirm(`Tem certeza que deseja excluir ${selectedUsers.length} usuários?`)) {
            for (const userId of selectedUsers) {
              await adminService.deleteUser(userId)
            }
          }
          break
        default:
          console.log('Unknown bulk action:', action)
      }
      setSelectedUsers([])
      await loadAdminData()
    } catch (error) {
      console.error('Erro na ação em massa:', error)
      alert('Erro ao executar ação em massa. Tente novamente.')
    }
  }

  const handleSystemAction = async (action) => {
    try {
      switch (action) {
        case 'backup':
          alert('Backup iniciado com sucesso!')
          break
        case 'maintenance':
          alert('Modo manutenção ativado!')
          break
        case 'restart':
          if (confirm('Tem certeza que deseja reiniciar o sistema?')) {
            alert('Sistema reiniciado com sucesso!')
          }
          break
        default:
          console.log('Unknown system action:', action)
      }
    } catch (error) {
      console.error('Erro na ação do sistema:', error)
      alert('Erro ao executar ação do sistema. Tente novamente.')
    }
  }

  const handleTransactionAction = async (transactionId, action) => {
    try {
      switch (action) {
        case 'approve':
          await adminService.updateTransactionStatus(transactionId, 'completed')
          await loadAdminData()
          break
        case 'reject':
          await adminService.updateTransactionStatus(transactionId, 'failed')
          await loadAdminData()
          break
        default:
          console.log('Unknown action:', action, transactionId)
      }
    } catch (error) {
      console.error('Erro na ação da transação:', error)
      setError('Não foi possível realizar esta ação')
    }
  }

  const handleGenerateReport = async (type) => {
    try {
      const report = await adminService.generateReport(type, {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
        to: new Date()
      })
      
      // Download do relatório (simulação)
      const dataStr = JSON.stringify(report, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `relatorio-${type}-${Date.now()}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      setError('Não foi possível gerar o relatório')
    }
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Carregando painel administrativo...</p>
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
                <div className="w-8 h-8 bg-red-500 border-2 border-white rounded-lg flex items-center justify-center">
                  <Crown size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold">AXION<span className="font-light">ADMIN</span></span>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuários, logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-64"
                />
              </div>

              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative">
                <AlertTriangle size={20} className="text-yellow-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{admin.name}</p>
                  <p className="text-xs text-red-400">Administrador</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Crown size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900/50 border-r border-gray-800 transition-transform duration-300 mt-16 lg:mt-0`}>
          <nav className="p-4 space-y-2">
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
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
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
              <div>
                <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
                <p className="text-gray-400">Bem-vindo, {admin.name}!</p>
              </div>

              {/* Admin Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-sm text-green-400">
                          <TrendingUp size={16} />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  )
                })}
              </div>

              {/* System Alerts */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Alertas do Sistema</h2>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-xl">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        alert.type === 'success' ? 'bg-green-500/20 text-green-400' :
                        alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        alert.type === 'error' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {alert.type === 'success' ? <CheckCircle size={20} /> :
                         alert.type === 'warning' ? <AlertTriangle size={20} /> :
                         alert.type === 'error' ? <AlertTriangle size={20} /> :
                         <AlertTriangle size={20} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{alert.message}</p>
                        <p className="text-gray-400 text-sm">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all text-left">
                  <Users size={24} className="text-blue-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">Gerenciar Usuários</h3>
                  <p className="text-gray-400 text-sm">Ver todos os usuários</p>
                </button>
                
                <button className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all text-left">
                  <Server size={24} className="text-green-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">Status Servidores</h3>
                  <p className="text-gray-400 text-sm">Monitorar sistemas</p>
                </button>
                
                <button className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all text-left">
                  <Shield size={24} className="text-purple-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">Segurança</h3>
                  <p className="text-gray-400 text-sm">Verificar ameaças</p>
                </button>
                
                <button className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all text-left">
                  <Download size={24} className="text-orange-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">Exportar Dados</h3>
                  <p className="text-gray-400 text-sm">Baixar relatórios</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
                <p className="text-gray-400">Visualize e gerencie todos os usuários da plataforma</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Todos os Usuários</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                      <Filter size={18} className="text-gray-400" />
                      <select className="bg-transparent border-none outline-none text-white">
                        <option value="">Todos os planos</option>
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="vip">VIP</option>
                      </select>
                    </div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                      Exportar CSV
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Usuário</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Plano</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Receita</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Data</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.plan === 'vip' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              user.plan === 'pro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {user.plan.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white font-medium">{user.revenue}</td>
                          <td className="py-3 px-4 text-gray-400">{user.joinDate}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleUserAction(user.id, 'view')}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                              >
                                <Eye size={16} className="text-gray-400" />
                              </button>
                              {user.status === 'active' ? (
                                <button 
                                  onClick={() => handleUserAction(user.id, 'suspend')}
                                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                                >
                                  <Ban size={16} className="text-yellow-400" />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                                >
                                  <CheckCircle size={16} className="text-green-400" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
