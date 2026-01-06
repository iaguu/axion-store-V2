// Sistema de Banco de Dados Local para Axion Store
class LocalDB {
  constructor() {
    this.dbName = 'axion_store_db'
    this.version = 1
    this.db = null
    this.initPromise = null
  }

  async init() {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Store de usuários
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' })
          userStore.createIndex('email', 'email', { unique: true })
          userStore.createIndex('plan', 'plan', { unique: false })
        }

        // Store de transações
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' })
          transactionStore.createIndex('userId', 'userId', { unique: false })
          transactionStore.createIndex('status', 'status', { unique: false })
          transactionStore.createIndex('method', 'method', { unique: false })
          transactionStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Store de produtos/serviços
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' })
          productStore.createIndex('category', 'category', { unique: false })
          productStore.createIndex('type', 'type', { unique: false })
          productStore.createIndex('status', 'status', { unique: false })
        }

        // Store de cards
        if (!db.objectStoreNames.contains('cards')) {
          const cardStore = db.createObjectStore('cards', { keyPath: 'id' })
          cardStore.createIndex('userId', 'userId', { unique: false })
          cardStore.createIndex('status', 'status', { unique: false })
          cardStore.createIndex('type', 'type', { unique: false })
        }

        // Store de bots
        if (!db.objectStoreNames.contains('bots')) {
          const botStore = db.createObjectStore('bots', { keyPath: 'id' })
          botStore.createIndex('userId', 'userId', { unique: false })
          botStore.createIndex('status', 'status', { unique: false })
          botStore.createIndex('type', 'type', { unique: false })
        }

        // Store de consultas
        if (!db.objectStoreNames.contains('queries')) {
          const queryStore = db.createObjectStore('queries', { keyPath: 'id' })
          queryStore.createIndex('userId', 'userId', { unique: false })
          queryStore.createIndex('type', 'type', { unique: false })
          queryStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Store de atividades
        if (!db.objectStoreNames.contains('activities')) {
          const activityStore = db.createObjectStore('activities', { keyPath: 'id' })
          activityStore.createIndex('userId', 'userId', { unique: false })
          activityStore.createIndex('type', 'type', { unique: false })
          activityStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Store de estatísticas
        if (!db.objectStoreNames.contains('statistics')) {
          const statsStore = db.createObjectStore('statistics', { keyPath: 'id' })
          statsStore.createIndex('userId', 'userId', { unique: false })
          statsStore.createIndex('type', 'type', { unique: false })
          statsStore.createIndex('period', 'period', { unique: false })
        }

        // Store de afiliados
        if (!db.objectStoreNames.contains('affiliates')) {
          const affiliateStore = db.createObjectStore('affiliates', { keyPath: 'id' })
          affiliateStore.createIndex('userId', 'userId', { unique: true })
          affiliateStore.createIndex('level', 'level', { unique: false })
          affiliateStore.createIndex('referralCode', 'referralCode', { unique: true })
        }

        // Store de tarefas de afiliados
        if (!db.objectStoreNames.contains('affiliate_tasks')) {
          const taskStore = db.createObjectStore('affiliate_tasks', { keyPath: 'id' })
          taskStore.createIndex('userId', 'userId', { unique: false })
          taskStore.createIndex('status', 'status', { unique: false })
          taskStore.createIndex('type', 'type', { unique: false })
          taskStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Store de transações de afiliados
        if (!db.objectStoreNames.contains('affiliate_transactions')) {
          const transactionStore = db.createObjectStore('affiliate_transactions', { keyPath: 'id' })
          transactionStore.createIndex('userId', 'userId', { unique: false })
          transactionStore.createIndex('status', 'status', { unique: false })
          transactionStore.createIndex('type', 'type', { unique: false })
          transactionStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Store de bônus de afiliados
        if (!db.objectStoreNames.contains('affiliate_bonuses')) {
          const bonusStore = db.createObjectStore('affiliate_bonuses', { keyPath: 'id' })
          bonusStore.createIndex('userId', 'userId', { unique: false })
          bonusStore.createIndex('type', 'type', { unique: false })
          bonusStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Store de indicações
        if (!db.objectStoreNames.contains('referrals')) {
          const referralStore = db.createObjectStore('referrals', { keyPath: 'id' })
          referralStore.createIndex('referrerId', 'referrerId', { unique: false })
          referralStore.createIndex('referredId', 'referredId', { unique: false })
          referralStore.createIndex('status', 'status', { unique: false })
          referralStore.createIndex('createdAt', 'createdAt', { unique: false })
        }
      }
    })

    return this.initPromise
  }

  // Método para garantir que o banco esteja inicializado
  async ensureDB() {
    if (!this.db) {
      await this.init()
    }
    return this.db
  }

  // Método genérico para adicionar dados
  async add(storeName, data) {
    await this.ensureDB()
    const transaction = this.db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.add(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Método genérico para obter dados
  async get(storeName, id) {
    await this.ensureDB()
    const transaction = this.db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Método genérico para obter todos os dados
  async getAll(storeName, indexName = null, indexValue = null) {
    await this.ensureDB()
    const transaction = this.db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      let request
      
      if (indexName && indexValue !== null) {
        const index = store.index(indexName)
        request = index.getAll(indexValue)
      } else {
        request = store.getAll()
      }
      
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Método genérico para atualizar dados
  async update(storeName, data) {
    await this.ensureDB()
    const transaction = this.db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.put(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Método genérico para deletar dados
  async delete(storeName, id) {
    await this.ensureDB()
    const transaction = this.db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Métodos específicos para usuários
  async createUser(userData) {
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return this.add('users', user)
  }

  async getUserByEmail(email) {
    await this.ensureDB()
    const transaction = this.db.transaction(['users'], 'readonly')
    const store = transaction.objectStore('users')
    const index = store.index('email')
    
    return new Promise((resolve, reject) => {
      const request = index.get(email)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async updateUser(userId, userData) {
    const existingUser = await this.get('users', userId)
    if (existingUser) {
      const updatedUser = {
        ...existingUser,
        ...userData,
        updatedAt: new Date().toISOString()
      }
      return this.update('users', updatedUser)
    }
    throw new Error('Usuário não encontrado')
  }

  // Métodos específicos para transações
  async createTransaction(transactionData) {
    const transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...transactionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return this.add('transactions', transaction)
  }

  async getUserTransactions(userId, limit = 50) {
    await this.ensureDB()
    const transaction = this.db.transaction(['transactions'], 'readonly')
    const store = transaction.objectStore('transactions')
    const index = store.index('userId')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(userId)
      request.onsuccess = () => {
        const transactions = request.result
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit)
        resolve(transactions)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Métodos específicos para cards
  async createCard(cardData) {
    const card = {
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...cardData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return this.add('cards', card)
  }

  async getUserCards(userId) {
    return this.getAll('cards', 'userId', userId)
  }

  // Métodos específicos para bots
  async createBot(botData) {
    const bot = {
      id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...botData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return this.add('bots', bot)
  }

  async getUserBots(userId) {
    return this.getAll('bots', 'userId', userId)
  }

  // Métodos específicos para consultas
  async createQuery(queryData) {
    const query = {
      id: `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...queryData,
      createdAt: new Date().toISOString()
    }
    return this.add('queries', query)
  }

  async getUserQueries(userId, limit = 100) {
    await this.ensureDB()
    const transaction = this.db.transaction(['queries'], 'readonly')
    const store = transaction.objectStore('queries')
    const index = store.index('userId')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(userId)
      request.onsuccess = () => {
        const queries = request.result
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit)
        resolve(queries)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Métodos específicos para atividades
  async createActivity(activityData) {
    const activity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...activityData,
      createdAt: new Date().toISOString()
    }
    return this.add('activities', activity)
  }

  async getUserActivities(userId, limit = 50) {
    await this.ensureDB()
    const transaction = this.db.transaction(['activities'], 'readonly')
    const store = transaction.objectStore('activities')
    const index = store.index('userId')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(userId)
      request.onsuccess = () => {
        const activities = request.result
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit)
        resolve(activities)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Métodos específicos para estatísticas
  async getStatistics(userId, type = 'all') {
    const stats = await this.getAll('statistics', 'userId', userId)
    
    if (type === 'all') {
      return stats
    }
    
    return stats.filter(stat => stat.type === type)
  }

  async updateStatistics(userId, statsData) {
    const stats = {
      id: `stats_${userId}_${Date.now()}`,
      userId,
      ...statsData,
      period: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    return this.add('statistics', stats)
  }

  // Método para limpar dados antigos
  async cleanupOldData(daysToKeep = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    
    const stores = ['activities', 'queries', 'transactions']
    
    for (const storeName of stores) {
      const allData = await this.getAll(storeName)
      const oldData = allData.filter(item => new Date(item.createdAt) < cutoffDate)
      
      for (const item of oldData) {
        await this.delete(storeName, item.id)
      }
    }
  }

  // Método para exportar dados
  async exportUserData(userId) {
    const userData = await this.get('users', userId)
    const transactions = await this.getUserTransactions(userId)
    const cards = await this.getUserCards(userId)
    const bots = await this.getUserBots(userId)
    const queries = await this.getUserQueries(userId)
    const activities = await this.getUserActivities(userId)
    const statistics = await this.getStatistics(userId)

    return {
      user: userData,
      transactions,
      cards,
      bots,
      queries,
      activities,
      statistics,
      exportedAt: new Date().toISOString()
    }
  }
}

// Instância global do banco de dados
const localDB = new LocalDB()

export default localDB
