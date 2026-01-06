import localDB from './localDB'

export class AffiliateService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutos
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  getCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  clearCache() {
    this.cache.clear()
  }

  // Criar perfil de afiliado
  async createAffiliateProfile(userId, affiliateData) {
    try {
      const profile = {
        id: `affiliate_${userId}`,
        userId,
        ...affiliateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      return await localDB.add('affiliates', profile)
    } catch (error) {
      console.error('Erro ao criar perfil de afiliado:', error)
      throw error
    }
  }

  // Obter perfil de afiliado
  async getAffiliateProfile(userId) {
    try {
      const cacheKey = `affiliate_profile_${userId}`
      const cached = this.getCache(cacheKey)
      
      if (cached) return cached

      const affiliates = await localDB.getAll('affiliates', 'userId', userId)
      const profile = affiliates[0] || null

      if (profile) {
        this.setCache(cacheKey, profile)
      }

      return profile
    } catch (error) {
      console.error('Erro ao obter perfil de afiliado:', error)
      return null
    }
  }

  // Atualizar perfil de afiliado
  async updateAffiliateProfile(userId, updateData) {
    try {
      const existingProfile = await this.getAffiliateProfile(userId)
      if (!existingProfile) {
        throw new Error('Perfil de afiliado não encontrado')
      }

      const updatedProfile = {
        ...existingProfile,
        ...updateData,
        updatedAt: new Date().toISOString()
      }

      await localDB.update('affiliates', updatedProfile)
      
      // Limpar cache
      this.cache.delete(`affiliate_profile_${userId}`)
      
      return updatedProfile
    } catch (error) {
      console.error('Erro ao atualizar perfil de afiliado:', error)
      throw error
    }
  }

  // Criar tarefa diária
  async createDailyTask(taskData) {
    try {
      const task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...taskData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
      return await localDB.add('affiliate_tasks', task)
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      throw error
    }
  }

  // Obter tarefas do afiliado
  async getAffiliateTasks(userId, date = null) {
    try {
      const cacheKey = `affiliate_tasks_${userId}_${date || 'today'}`
      const cached = this.getCache(cacheKey)
      
      if (cached) return cached

      const allTasks = await localDB.getAll('affiliate_tasks')
      let userTasks = allTasks.filter(task => task.userId === userId)

      // Filtrar por data se especificada
      if (date) {
        const targetDate = new Date(date).toDateString()
        userTasks = userTasks.filter(task => 
          new Date(task.createdAt).toDateString() === targetDate
        )
      } else {
        // Tarefas de hoje
        const today = new Date().toDateString()
        userTasks = userTasks.filter(task => 
          new Date(task.createdAt).toDateString() === today
        )
      }

      this.setCache(cacheKey, userTasks)
      return userTasks
    } catch (error) {
      console.error('Erro ao obter tarefas do afiliado:', error)
      return []
    }
  }

  // Completar tarefa
  async completeTask(taskId, userId) {
    try {
      const task = await localDB.get('affiliate_tasks', taskId)
      if (!task || task.userId !== userId) {
        throw new Error('Tarefa não encontrada ou não pertence ao usuário')
      }

      const updatedTask = {
        ...task,
        status: 'completed',
        completedAt: new Date().toISOString()
      }

      await localDB.update('affiliate_tasks', updatedTask)
      
      // Limpar cache
      this.cache.delete(`affiliate_tasks_${userId}_today`)
      
      return updatedTask
    } catch (error) {
      console.error('Erro ao completar tarefa:', error)
      throw error
    }
  }

  // Criar transação de afiliado (saque)
  async createAffiliateTransaction(userId, transactionData) {
    try {
      const transaction = {
        id: `affiliate_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        ...transactionData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
      return await localDB.add('affiliate_transactions', transaction)
    } catch (error) {
      console.error('Erro ao criar transação de afiliado:', error)
      throw error
    }
  }

  // Obter histórico de transações
  async getAffiliateTransactions(userId, limit = 50) {
    try {
      const cacheKey = `affiliate_transactions_${userId}`
      const cached = this.getCache(cacheKey)
      
      if (cached) return cached

      const allTransactions = await localDB.getAll('affiliate_transactions')
      const userTransactions = allTransactions
        .filter(tx => tx.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)

      this.setCache(cacheKey, userTransactions)
      return userTransactions
    } catch (error) {
      console.error('Erro ao obter transações do afiliado:', error)
      return []
    }
  }

  // Adicionar bônus por print
  async addPrintBonus(userId, bonusData) {
    try {
      const bonus = {
        id: `bonus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        ...bonusData,
        createdAt: new Date().toISOString(),
        type: 'print_bonus'
      }
      return await localDB.add('affiliate_bonuses', bonus)
    } catch (error) {
      console.error('Erro ao adicionar bônus:', error)
      throw error
    }
  }

  // Obter bônus do afiliado
  async getAffiliateBonuses(userId, limit = 20) {
    try {
      const cacheKey = `affiliate_bonuses_${userId}`
      const cached = this.getCache(cacheKey)
      
      if (cached) return cached

      const allBonuses = await localDB.getAll('affiliate_bonuses')
      const userBonuses = allBonuses
        .filter(bonus => bonus.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)

      this.setCache(cacheKey, userBonuses)
      return userBonuses
    } catch (error) {
      console.error('Erro ao obter bônus do afiliado:', error)
      return []
    }
  }

  // Criar indicação
  async createReferral(referrerId, referralData) {
    try {
      const referral = {
        id: `referral_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        referrerId,
        ...referralData,
        createdAt: new Date().toISOString(),
        status: 'pending',
        commission: 0
      }
      return await localDB.add('referrals', referral)
    } catch (error) {
      console.error('Erro ao criar indicação:', error)
      throw error
    }
  }

  // Obter indicações do afiliado
  async getReferrals(referrerId, limit = 100) {
    try {
      const cacheKey = `referrals_${referrerId}`
      const cached = this.getCache(cacheKey)
      
      if (cached) return cached

      const allReferrals = await localDB.getAll('referrals')
      const userReferrals = allReferrals
        .filter(referral => referral.referrerId === referrerId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit)

      this.setCache(cacheKey, userReferrals)
      return userReferrals
    } catch (error) {
      console.error('Erro ao obter indicações:', error)
      return []
    }
  }

  // Calcular estatísticas do afiliado
  async getAffiliateStats(userId) {
    try {
      const cacheKey = `affiliate_stats_${userId}`
      const cached = this.getCache(cacheKey)
      
      if (cached) return cached

      const [transactions, referrals, bonuses, tasks] = await Promise.all([
        this.getAffiliateTransactions(userId),
        this.getReferrals(userId),
        this.getAffiliateBonuses(userId),
        this.getAffiliateTasks(userId)
      ])

      const totalEarned = transactions
        .filter(tx => tx.status === 'completed')
        .reduce((sum, tx) => sum + (tx.amount || 0), 0)

      const totalWithdrawn = transactions
        .filter(tx => tx.type === 'withdraw' && tx.status === 'completed')
        .reduce((sum, tx) => sum + (tx.amount || 0), 0)

      const availableBalance = totalEarned - totalWithdrawn + bonuses.reduce((sum, bonus) => sum + (bonus.amount || 0), 0)

      const completedTasks = tasks.filter(task => task.status === 'completed').length
      const totalTaskRewards = tasks
        .filter(task => task.status === 'completed')
        .reduce((sum, task) => sum + (task.reward || 0), 0)

      const activeReferrals = referrals.filter(referral => referral.status === 'completed').length
      const totalCommission = referrals
        .filter(referral => referral.status === 'completed')
        .reduce((sum, referral) => sum + (referral.commission || 0), 0)

      const stats = {
        totalEarned,
        totalWithdrawn,
        availableBalance,
        completedTasks,
        totalTaskRewards,
        totalReferrals: referrals.length,
        activeReferrals,
        totalCommission,
        referralCode: `AXION${userId.toUpperCase().slice(0, 6)}${Math.floor(Math.random() * 1000)}`,
        referralLink: `https://axionstore.com/register?ref=AXION${userId.toUpperCase().slice(0, 6)}${Math.floor(Math.random() * 1000)}`,
        level: this.calculateAffiliateLevel(totalEarned),
        commissionRate: this.calculateCommissionRate(totalEarned),
        lastUpdated: new Date().toISOString()
      }

      this.setCache(cacheKey, stats)
      return stats
    } catch (error) {
      console.error('Erro ao calcular estatísticas do afiliado:', error)
      return this.getDefaultStats()
    }
  }

  // Calcular nível do afiliado
  calculateAffiliateLevel(totalEarned) {
    if (totalEarned >= 10000) return { name: 'Diamante', color: 'from-purple-500 to-purple-600', commission: 25 }
    if (totalEarned >= 5000) return { name: 'Ouro', color: 'from-yellow-500 to-yellow-600', commission: 20 }
    if (totalEarned >= 2500) return { name: 'Prata', color: 'from-gray-400 to-gray-500', commission: 15 }
    return { name: 'Bronze', color: 'from-orange-500 to-orange-600', commission: 10 }
  }

  // Calcular taxa de comissão
  calculateCommissionRate(totalEarned) {
    if (totalEarned >= 10000) return 25
    if (totalEarned >= 5000) return 20
    if (totalEarned >= 2500) return 15
    return 10
  }

  // Estatísticas padrão
  getDefaultStats() {
    return {
      totalEarned: 0,
      totalWithdrawn: 0,
      availableBalance: 0,
      completedTasks: 0,
      totalTaskRewards: 0,
      totalReferrals: 0,
      activeReferrals: 0,
      totalCommission: 0,
      referralCode: '',
      referralLink: '',
      level: { name: 'Bronze', color: 'from-orange-500 to-orange-600', commission: 10 },
      commissionRate: 10,
      lastUpdated: new Date().toISOString()
    }
  }

  // Inicializar dados de exemplo para afiliado
  async initializeSampleData(userId) {
    try {
      // Criar perfil de afiliado
      await this.createAffiliateProfile(userId, {
        level: 'Bronze',
        joinDate: new Date().toISOString(),
        totalEarned: 0,
        availableBalance: 0,
        pendingWithdraw: 0,
        referralCode: `AXION${userId.toUpperCase().slice(0, 6)}${Math.floor(Math.random() * 1000)}`,
        referralLink: `https://axionstore.com/register?ref=AXION${userId.toUpperCase().slice(0, 6)}${Math.floor(Math.random() * 1000)}`,
        totalReferrals: 0,
        activeReferrals: 0,
        commissionRate: 10
      })

      // Criar tarefas diárias
      const dailyTasks = [
        {
          userId,
          title: 'Divulgar Link da Comunidade',
          description: 'Compartilhe o link do WhatsApp da Axion Community em pelo menos 3 grupos',
          reward: 5.00,
          type: 'social',
          link: 'https://chat.whatsapp.com/L60TVRUEeOBFgs7jnN1bur',
          instructions: [
            '1. Clique no link da comunidade',
            '2. Compartilhe em 3 grupos diferentes',
            '3. Tire print de cada compartilhamento',
            '4. Envie os prints no sistema'
          ]
        },
        {
          userId,
          title: 'Seguir Instagram Oficial',
          description: 'Siga o perfil @axionenterprise e curta 5 posts',
          reward: 3.00,
          type: 'social',
          link: 'https://www.instagram.com/axionenterprise',
          instructions: [
            '1. Acesse o perfil oficial',
            '2. Siga a página',
            '3. Curte 5 posts recentes',
            '4. Tire print do seu perfil seguindo',
            '5. Envie o print no sistema'
          ]
        },
        {
          userId,
          title: 'Indicar Novo Membro',
          description: 'Traga um novo membro para a plataforma usando seu link de afiliado',
          reward: 15.00,
          type: 'referral',
          link: null,
          instructions: [
            '1. Compartilhe seu link de afiliado',
            '2. A pessoa deve se cadastrar usando seu link',
            '3. Você receberá R$ 15,00 automaticamente',
            '4. O valor será creditado na hora'
          ]
        },
        {
          userId,
          title: 'Engajamento Diário',
          description: 'Faça login e acesse o painel por 5 minutos consecutivos',
          reward: 2.00,
          type: 'daily',
          link: null,
          instructions: [
            '1. Faça login no painel',
            '2. Permaneça por 5 minutos',
            '3. A recompensa será creditada automaticamente',
            '4. Disponível uma vez por dia'
          ]
        }
      ]

      for (const task of dailyTasks) {
        await this.createDailyTask(task)
      }

      console.log('Dados de exemplo do afiliado inicializados com sucesso')
    } catch (error) {
      console.error('Erro ao inicializar dados de exemplo do afiliado:', error)
    }
  }
}

// Instância global do serviço de afiliados
const affiliateService = new AffiliateService()

export default affiliateService
