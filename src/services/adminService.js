// Serviço completo para Admin Panel
import { generateId, formatCurrency, formatDate } from '../utils/crypto'
import adminAuthService from './adminAuthService'

class AdminService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutos
  }

  clearCache() {
    this.cache.clear()
  }

  // Verificar se usuário tem permissão de admin
  checkAdminAuth() {
    return adminAuthService.checkAuth()
  }

  // Gerar dados de exemplo para admin
  generateAdminData() {
    const now = Date.now()
    
    return {
      overview: {
        totalUsers: 1247,
        activeUsers: 892,
        totalRevenue: 284750.50,
        monthlyRevenue: 47500.00,
        totalTransactions: 3421,
        conversionRate: 15.8,
        avgTicket: 83.20,
        churnRate: 2.3
      },
      
      users: [
        {
          id: generateId(),
          name: 'João Silva',
          email: 'joao@email.com',
          plan: 'pro',
          status: 'active',
          registeredAt: now - 1000 * 60 * 60 * 24 * 30,
          lastLogin: now - 1000 * 60 * 60 * 2,
          totalSpent: 1250.50,
          transactions: 23
        },
        {
          id: generateId(),
          name: 'Maria Santos',
          email: 'maria@email.com',
          plan: 'enterprise',
          status: 'active',
          registeredAt: now - 1000 * 60 * 60 * 24 * 60,
          lastLogin: now - 1000 * 60 * 30,
          totalSpent: 8475.00,
          transactions: 67
        },
        {
          id: generateId(),
          name: 'Pedro Costa',
          email: 'pedro@email.com',
          plan: 'basic',
          status: 'blocked',
          registeredAt: now - 1000 * 60 * 60 * 24 * 15,
          lastLogin: now - 1000 * 60 * 60 * 24 * 3,
          totalSpent: 197.00,
          transactions: 3
        }
      ],
      
      transactions: [
        {
          id: generateId(),
          userId: 'user_1',
          userName: 'João Silva',
          type: 'purchase',
          description: 'Card Visa **** 4532',
          amount: 500,
          status: 'completed',
          method: 'axionpay',
          timestamp: now - 1000 * 60 * 60 * 2,
          reference: `AX${Date.now()}`,
          ip: '192.168.1.100',
          riskScore: 'low'
        },
        {
          id: generateId(),
          userId: 'user_2',
          userName: 'Maria Santos',
          type: 'subscription',
          description: 'Plano Enterprise - Todos serviços',
          amount: 997,
          status: 'completed',
          method: 'crypto',
          timestamp: now - 1000 * 60 * 60 * 6,
          reference: `AX${Date.now() - 21600000}`,
          ip: '192.168.1.101',
          riskScore: 'low'
        },
        {
          id: generateId(),
          userId: 'user_3',
          userName: 'Pedro Costa',
          type: 'service',
          description: 'Database Search - 1000 consultas',
          amount: 447,
          status: 'pending',
          method: 'pix',
          timestamp: now - 1000 * 60 * 30,
          reference: `AX${Date.now() - 1800000}`,
          ip: '192.168.1.102',
          riskScore: 'medium'
        }
      ],
      
      services: [
        {
          id: 1,
          name: 'Cards Marketplace',
          totalUsers: 456,
          activeUsers: 342,
          revenue: 45750.00,
          growth: 12.5,
          status: 'active'
        },
        {
          id: 2,
          name: 'Database Search',
          totalUsers: 234,
          activeUsers: 189,
          revenue: 28450.00,
          growth: 8.3,
          status: 'active'
        },
        {
          id: 3,
          name: 'Bots & Automação',
          totalUsers: 123,
          activeUsers: 98,
          revenue: 15670.00,
          growth: 23.7,
          status: 'active'
        }
      ],
      
      security: {
        totalAlerts: 23,
        criticalAlerts: 2,
        blockedIps: 156,
        suspiciousLogins: 8,
        failedLogins: 1247,
        lastSecurityScan: now - 1000 * 60 * 60 * 2
      },
      
      system: {
        serverUptime: '99.98%',
        apiResponseTime: 145,
        databaseConnections: 89,
        storageUsed: '67.3%',
        bandwidthToday: '2.4TB',
        errorsLast24h: 3
      }
    }
  }

  // Salvar dados admin no localStorage
  saveAdminData(data) {
    localStorage.setItem('admin_data', JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  }

  // Carregar dados admin do localStorage
  loadAdminData() {
    const stored = localStorage.getItem('admin_data')
    
    if (!stored) return null
    
    const { data, timestamp } = JSON.parse(stored)
    
    // Verificar se os dados são muito antigos (mais de 1h)
    if (Date.now() - timestamp > 60 * 60 * 1000) {
      localStorage.removeItem('admin_data')
      return null
    }
    
    return data
  }

  async getOverview() {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const cacheKey = 'admin_overview'
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAdminData()
    if (storedData && storedData.overview) {
      this.cache.set(cacheKey, {
        data: storedData.overview,
        timestamp: Date.now()
      })
      return storedData.overview
    }

    const adminData = this.generateAdminData()
    this.saveAdminData(adminData)
    
    this.cache.set(cacheKey, {
      data: adminData.overview,
      timestamp: Date.now()
    })
    
    return adminData.overview
  }

  async getUsers(filters = {}) {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const cacheKey = `admin_users_${JSON.stringify(filters)}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAdminData()
    let users = storedData?.users || []

    // Aplicar filtros
    if (filters.status) {
      users = users.filter(user => user.status === filters.status)
    }
    if (filters.plan) {
      users = users.filter(user => user.plan === filters.plan)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      users = users.filter(user => 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      )
    }

    this.cache.set(cacheKey, {
      data: users,
      timestamp: Date.now()
    })
    
    return users
  }

  async getTransactions(filters = {}) {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const cacheKey = `admin_transactions_${JSON.stringify(filters)}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAdminData()
    let transactions = storedData?.transactions || []

    // Aplicar filtros
    if (filters.status) {
      transactions = transactions.filter(tx => tx.status === filters.status)
    }
    if (filters.method) {
      transactions = transactions.filter(tx => tx.method === filters.method)
    }
    if (filters.dateFrom) {
      transactions = transactions.filter(tx => tx.timestamp >= new Date(filters.dateFrom).getTime())
    }
    if (filters.dateTo) {
      transactions = transactions.filter(tx => tx.timestamp <= new Date(filters.dateTo).getTime())
    }

    this.cache.set(cacheKey, {
      data: transactions,
      timestamp: Date.now()
    })
    
    return transactions
  }

  async getServices() {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const cacheKey = 'admin_services'
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAdminData()
    const services = storedData?.services || []

    this.cache.set(cacheKey, {
      data: services,
      timestamp: Date.now()
    })
    
    return services
  }

  async getSecurityAlerts() {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const cacheKey = 'admin_security'
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAdminData()
    const security = storedData?.security || {}

    this.cache.set(cacheKey, {
      data: security,
      timestamp: Date.now()
    })
    
    return security
  }

  async getSystemStatus() {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const cacheKey = 'admin_system'
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAdminData()
    const system = storedData?.system || {}

    this.cache.set(cacheKey, {
      data: system,
      timestamp: Date.now()
    })
    
    return system
  }

  // Ações administrativas
  async updateUserStatus(userId, newStatus) {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const storedData = this.loadAdminData() || this.generateAdminData()
    const user = storedData.users.find(u => u.id === userId)
    
    if (user) {
      user.status = newStatus
      this.saveAdminData(storedData)
      this.clearCache()
      return { success: true, user }
    }
    
    throw new Error('Usuário não encontrado')
  }

  async updateUserPlan(userId, newPlan) {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const storedData = this.loadAdminData() || this.generateAdminData()
    const user = storedData.users.find(u => u.id === userId)
    
    if (user) {
      user.plan = newPlan
      this.saveAdminData(storedData)
      this.clearCache()
      return { success: true, user }
    }
    
    throw new Error('Usuário não encontrado')
  }

  async blockIp(ip) {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const storedData = this.loadAdminData() || this.generateAdminData()
    storedData.security.blockedIps++
    this.saveAdminData(storedData)
    this.clearCache()
    
    return { success: true, blockedIp: ip }
  }

  async updateTransactionStatus(transactionId, newStatus) {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const storedData = this.loadAdminData() || this.generateAdminData()
    const transaction = storedData.transactions.find(t => t.id === transactionId)
    
    if (transaction) {
      transaction.status = newStatus
      this.saveAdminData(storedData)
      this.clearCache()
      return { success: true, transaction }
    }
    
    throw new Error('Transação não encontrada')
  }

  async generateReport(type, dateRange) {
    if (!this.checkAdminAuth()) {
      throw new Error('Não autorizado')
    }

    const storedData = this.loadAdminData() || this.generateAdminData()
    
    let reportData = {}
    
    switch (type) {
      case 'revenue':
        reportData = {
          totalRevenue: storedData.overview.totalRevenue,
          monthlyRevenue: storedData.overview.monthlyRevenue,
          transactions: storedData.transactions.length,
          avgTicket: storedData.overview.avgTicket,
          conversionRate: storedData.overview.conversionRate
        }
        break
        
      case 'users':
        reportData = {
          totalUsers: storedData.overview.totalUsers,
          activeUsers: storedData.overview.activeUsers,
          churnRate: storedData.overview.churnRate,
          usersByPlan: this.groupUsersByPlan(storedData.users)
        }
        break
        
      case 'services':
        reportData = {
          services: storedData.services,
          totalRevenue: storedData.services.reduce((sum, s) => sum + s.revenue, 0),
          totalUsers: storedData.services.reduce((sum, s) => sum + s.totalUsers, 0)
        }
        break
        
      default:
        throw new Error('Tipo de relatório inválido')
    }
    
    return {
      id: generateId(),
      type,
      dateRange,
      generatedAt: Date.now(),
      data: reportData
    }
  }

  groupUsersByPlan(users) {
    return users.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1
      return acc
    }, {})
  }

  // Novos métodos para ações administrativas
  async updateUserStatus(userId, status) {
    const storedData = this.loadAdminData()
    const user = storedData.users.find(u => u.id === userId)
    
    if (user) {
      user.status = status
      user.updatedAt = Date.now()
      this.saveAdminData(storedData)
      this.clearCache()
    }
    return user
  }

  async updateUserPlan(userId, plan) {
    const storedData = this.loadAdminData()
    const user = storedData.users.find(u => u.id === userId)
    
    if (user) {
      user.plan = plan
      user.updatedAt = Date.now()
      this.saveAdminData(storedData)
      this.clearCache()
    }
    return user
  }

  async deleteUser(userId) {
    const storedData = this.loadAdminData()
    const userIndex = storedData.users.findIndex(u => u.id === userId)
    
    if (userIndex !== -1) {
      storedData.users.splice(userIndex, 1)
      storedData.overview.totalUsers--
      this.saveAdminData(storedData)
      this.clearCache()
    }
    return true
  }

  async updateTransactionStatus(transactionId, status) {
    const storedData = this.loadAdminData()
    const transaction = storedData.transactions.find(t => t.id === transactionId)
    
    if (transaction) {
      transaction.status = status
      transaction.updatedAt = Date.now()
      this.saveAdminData(storedData)
      this.clearCache()
    }
    return transaction
  }
}

export default new AdminService()
