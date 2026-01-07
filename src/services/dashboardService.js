// Serviço completo para o Dashboard
import { generateId, formatCurrency, formatDate } from '../utils/crypto'

class DashboardService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutos
  }

  clearCache() {
    this.cache.clear()
  }

  // Gerar dados de exemplo realistas
  generateSampleData(userId) {
    const now = Date.now()
    
    return {
      stats: {
        totalTransactions: 47,
        totalCards: 12,
        cardsActive: 8,
        totalBots: 5,
        totalQueries: 234,
        monthlyRevenue: 8750.50,
        activeSubscriptions: 3,
        conversionRate: 12.5,
        avgTicket: 186.20,
        successRate: 94.5,
        operationsPerHour: 23
      },
      
      activities: [
        {
          id: generateId(),
          type: 'purchase',
          title: 'Novo card adquirido',
          description: 'Card Visa **** 4532 - R$ 500',
          timestamp: now - 1000 * 60 * 15,
          status: 'completed',
          amount: 500
        },
        {
          id: generateId(),
          type: 'bot',
          title: 'Bot WhatsApp ativado',
          description: 'Bot de vendas automático',
          timestamp: now - 1000 * 60 * 60 * 2,
          status: 'active',
          amount: 197
        },
        {
          id: generateId(),
          type: 'query',
          title: 'Consulta realizada',
          description: 'Database Search - CPF/CNPJ',
          timestamp: now - 1000 * 60 * 60 * 4,
          status: 'completed',
          amount: 47
        },
        {
          id: generateId(),
          type: 'subscription',
          title: 'Assinatura renovada',
          description: 'Plano Pro - IA Tools',
          timestamp: now - 1000 * 60 * 60 * 24,
          status: 'active',
          amount: 297
        }
      ],
      
      cards: [
        {
          id: generateId(),
          type: 'Visa',
          last4: '4532',
          status: 'active',
          limit: 5000,
          used: 1250.50,
          expiry: '12/25',
          brand: 'green'
        },
        {
          id: generateId(),
          type: 'Mastercard',
          last4: '7891',
          status: 'active',
          limit: 3000,
          used: 450.00,
          expiry: '08/25',
          brand: 'orange'
        },
        {
          id: generateId(),
          type: 'Elo',
          last4: '2345',
          status: 'blocked',
          limit: 2000,
          used: 0,
          expiry: '03/26',
          brand: 'blue'
        }
      ],
      
      bots: [
        {
          id: generateId(),
          name: 'Bot Vendas WhatsApp',
          type: 'whatsapp',
          status: 'active',
          messages: 15420,
          conversions: 1847,
          uptime: '99.8%',
          lastActivity: now - 1000 * 60 * 5
        },
        {
          id: generateId(),
          name: 'Bot Trading Crypto',
          type: 'trading',
          status: 'active',
          trades: 342,
          profit: 2340.50,
          uptime: '99.9%',
          lastActivity: now - 1000 * 60 * 2
        },
        {
          id: generateId(),
          name: 'Bot Atendimento',
          type: 'telegram',
          status: 'inactive',
          messages: 8934,
          conversions: 567,
          uptime: '0%',
          lastActivity: now - 1000 * 60 * 60 * 48
        }
      ],
      
      transactions: [
        {
          id: generateId(),
          type: 'purchase',
          description: 'Card Visa **** 4532',
          amount: 500,
          status: 'completed',
          method: 'axionpay',
          timestamp: now - 1000 * 60 * 60 * 2,
          reference: `AX${Date.now()}`
        },
        {
          id: generateId(),
          type: 'subscription',
          description: 'Plano Pro - IA Tools',
          amount: 297,
          status: 'completed',
          method: 'crypto',
          timestamp: now - 1000 * 60 * 60 * 24,
          reference: `AX${Date.now() - 86400000}`
        },
        {
          id: generateId(),
          type: 'service',
          description: 'Database Search - 100 consultas',
          amount: 147,
          status: 'pending',
          method: 'pix',
          timestamp: now - 1000 * 60 * 60 * 6,
          reference: `AX${Date.now() - 21600000}`
        }
      ],
      
      queries: [
        {
          id: generateId(),
          type: 'cpf',
          query: '123.456.789-00',
          result: 'Dados encontrados',
          timestamp: now - 1000 * 60 * 30,
          status: 'completed'
        },
        {
          id: generateId(),
          type: 'cnpj',
          query: '12.345.678/0001-90',
          result: 'Empresa localizada',
          timestamp: now - 1000 * 60 * 60 * 2,
          status: 'completed'
        },
        {
          id: generateId(),
          type: 'placa',
          query: 'ABC1234',
          result: 'Veículo encontrado',
          timestamp: now - 1000 * 60 * 60 * 4,
          status: 'completed'
        }
      ]
    }
  }

  // Salvar dados no localStorage
  saveUserData(userId, data) {
    const key = `dashboard_${userId}`
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  }

  // Carregar dados do localStorage
  loadUserData(userId) {
    const key = `dashboard_${userId}`
    const stored = localStorage.getItem(key)
    
    if (!stored) return null
    
    const { data, timestamp } = JSON.parse(stored)
    
    // Verificar se os dados são muito antigos (mais de 24h)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
  }

  async getUserStats(userId) {
    const cacheKey = `stats_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    // Tentar carregar do localStorage primeiro
    const storedData = this.loadUserData(userId)
    if (storedData && storedData.stats) {
      this.cache.set(cacheKey, {
        data: storedData.stats,
        timestamp: Date.now()
      })
      return storedData.stats
    }

    // Gerar dados de exemplo
    const sampleData = this.generateSampleData(userId)
    this.saveUserData(userId, sampleData)
    
    this.cache.set(cacheKey, {
      data: sampleData.stats,
      timestamp: Date.now()
    })
    
    return sampleData.stats
  }

  async getRecentActivities(userId) {
    const cacheKey = `activities_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadUserData(userId)
    if (storedData && storedData.activities) {
      this.cache.set(cacheKey, {
        data: storedData.activities,
        timestamp: Date.now()
      })
      return storedData.activities
    }

    const sampleData = this.generateSampleData(userId)
    this.saveUserData(userId, sampleData)
    
    this.cache.set(cacheKey, {
      data: sampleData.activities,
      timestamp: Date.now()
    })
    
    return sampleData.activities
  }

  async getUserCards(userId) {
    const cacheKey = `cards_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadUserData(userId)
    if (storedData && storedData.cards) {
      this.cache.set(cacheKey, {
        data: storedData.cards,
        timestamp: Date.now()
      })
      return storedData.cards
    }

    const sampleData = this.generateSampleData(userId)
    this.saveUserData(userId, sampleData)
    
    this.cache.set(cacheKey, {
      data: sampleData.cards,
      timestamp: Date.now()
    })
    
    return sampleData.cards
  }

  async getUserBots(userId) {
    const cacheKey = `bots_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadUserData(userId)
    if (storedData && storedData.bots) {
      this.cache.set(cacheKey, {
        data: storedData.bots,
        timestamp: Date.now()
      })
      return storedData.bots
    }

    const sampleData = this.generateSampleData(userId)
    this.saveUserData(userId, sampleData)
    
    this.cache.set(cacheKey, {
      data: sampleData.bots,
      timestamp: Date.now()
    })
    
    return sampleData.bots
  }

  async getUserTransactions(userId) {
    const cacheKey = `transactions_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadUserData(userId)
    if (storedData && storedData.transactions) {
      this.cache.set(cacheKey, {
        data: storedData.transactions,
        timestamp: Date.now()
      })
      return storedData.transactions
    }

    const sampleData = this.generateSampleData(userId)
    this.saveUserData(userId, sampleData)
    
    this.cache.set(cacheKey, {
      data: sampleData.transactions,
      timestamp: Date.now()
    })
    
    return sampleData.transactions
  }

  async getUserQueries(userId) {
    const cacheKey = `queries_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadUserData(userId)
    if (storedData && storedData.queries) {
      this.cache.set(cacheKey, {
        data: storedData.queries,
        timestamp: Date.now()
      })
      return storedData.queries
    }

    const sampleData = this.generateSampleData(userId)
    this.saveUserData(userId, sampleData)
    
    this.cache.set(cacheKey, {
      data: sampleData.queries,
      timestamp: Date.now()
    })
    
    return sampleData.queries
  }

  async initializeSampleData(userId) {
    console.log('Inicializando dados de exemplo para usuário:', userId)
    const sampleData = this.generateSampleData(userId)
    this.saveUserData(userId, sampleData)
    
    // Limpar cache para forçar recarregamento
    this.clearCache()
    
    return sampleData
  }

  // Métodos para ações do usuário
  async addTransaction(userId, transaction) {
    const storedData = this.loadUserData(userId) || this.generateSampleData(userId)
    
    const newTransaction = {
      id: generateId(),
      ...transaction,
      timestamp: Date.now(),
      reference: `AX${Date.now()}`
    }
    
    storedData.transactions.unshift(newTransaction)
    storedData.stats.totalTransactions++
    storedData.stats.monthlyRevenue += transaction.amount
    
    this.saveUserData(userId, storedData)
    this.clearCache()
    
    return newTransaction
  }

  async addCard(userId, card) {
    const storedData = this.loadUserData(userId) || this.generateSampleData(userId)
    
    const newCard = {
      id: generateId(),
      ...card,
      status: 'pending'
    }
    
    storedData.cards.push(newCard)
    storedData.stats.totalCards++
    
    this.saveUserData(userId, storedData)
    this.clearCache()
    
    return newCard
  }

  async addBot(userId, bot) {
    const storedData = this.loadUserData(userId) || this.generateSampleData(userId)
    
    const newBot = {
      id: generateId(),
      ...bot,
      status: 'inactive',
      messages: 0,
      conversions: 0,
      uptime: '0%',
      lastActivity: Date.now()
    }
    
    storedData.bots.push(newBot)
    storedData.stats.totalBots++
    
    this.saveUserData(userId, storedData)
    this.clearCache()
    
    return newBot
  }

  async addQuery(userId, query) {
    const storedData = this.loadUserData(userId) || this.generateSampleData(userId)
    
    const newQuery = {
      id: generateId(),
      ...query,
      timestamp: Date.now(),
      status: 'completed'
    }
    
    storedData.queries.unshift(newQuery)
    storedData.stats.totalQueries++
    
    this.saveUserData(userId, storedData)
    this.clearCache()
    
    return newQuery
  }
}

export default new DashboardService()
