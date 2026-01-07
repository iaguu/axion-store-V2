// Serviço completo para Affiliate Panel
import { generateId, formatCurrency, formatDate } from '../utils/crypto'

class AffiliateService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutos
  }

  clearCache() {
    this.cache.clear()
  }

  // Gerar dados de exemplo para afiliado
  generateAffiliateData(userId) {
    const now = Date.now()
    
    return {
      profile: {
        id: `affiliate_${userId}`,
        userId,
        affiliateCode: `AX${userId.toUpperCase()}`,
        status: 'active',
        tier: 'gold',
        commissionRate: 15,
        totalEarned: 12475.50,
        currentBalance: 2340.75,
        totalWithdrawn: 10134.75,
        createdAt: now - 1000 * 60 * 60 * 24 * 90, // 90 dias atrás
        paymentMethod: 'pix',
        pixKey: 'affiliate@axionstore.com'
      },
      
      stats: {
        totalClicks: 12457,
        totalConversions: 347,
        conversionRate: 2.79,
        avgCommission: 35.95,
        monthlyEarnings: 2847.50,
        lastMonthEarnings: 2156.25,
        growth: 32.1
      },
      
      referrals: [
        {
          id: generateId(),
          name: 'João Silva',
          email: 'joao@email.com',
          plan: 'pro',
          status: 'active',
          registeredAt: now - 1000 * 60 * 60 * 24 * 15,
          totalSpent: 1250.50,
          commissionEarned: 187.58,
          lastActivity: now - 1000 * 60 * 60 * 2
        },
        {
          id: generateId(),
          name: 'Maria Santos',
          email: 'maria@email.com',
          plan: 'enterprise',
          status: 'active',
          registeredAt: now - 1000 * 60 * 60 * 24 * 30,
          totalSpent: 8475.00,
          commissionEarned: 1271.25,
          lastActivity: now - 1000 * 60 * 30
        },
        {
          id: generateId(),
          name: 'Pedro Costa',
          email: 'pedro@email.com',
          plan: 'basic',
          status: 'active',
          registeredAt: now - 1000 * 60 * 60 * 24 * 7,
          totalSpent: 197.00,
          commissionEarned: 29.55,
          lastActivity: now - 1000 * 60 * 60 * 24
        }
      ],
      
      commissions: [
        {
          id: generateId(),
          referralId: 'ref_1',
          referralName: 'João Silva',
          type: 'purchase',
          description: 'Card Visa **** 4532',
          amount: 500,
          commissionRate: 15,
          commissionAmount: 75,
          status: 'paid',
          timestamp: now - 1000 * 60 * 60 * 24 * 2,
          paidAt: now - 1000 * 60 * 60 * 24
        },
        {
          id: generateId(),
          referralId: 'ref_2',
          referralName: 'Maria Santos',
          type: 'subscription',
          description: 'Plano Enterprise - Todos serviços',
          amount: 997,
          commissionRate: 15,
          commissionAmount: 149.55,
          status: 'pending',
          timestamp: now - 1000 * 60 * 60 * 6,
          paidAt: null
        },
        {
          id: generateId(),
          referralId: 'ref_3',
          referralName: 'Pedro Costa',
          type: 'service',
          description: 'Database Search - 100 consultas',
          amount: 147,
          commissionRate: 15,
          commissionAmount: 22.05,
          status: 'pending',
          timestamp: now - 1000 * 60 * 60 * 12,
          paidAt: null
        }
      ],
      
      marketing: {
        totalLinks: 5,
        activeLinks: 3,
        topPerformingLink: {
          id: generateId(),
          name: 'Landing Page Principal',
          url: 'https://axionstore.com?ref=AXUSER123',
          clicks: 8934,
          conversions: 234,
          conversionRate: 2.62
        },
        links: [
          {
            id: generateId(),
            name: 'Landing Page Principal',
            url: 'https://axionstore.com?ref=AXUSER123',
            clicks: 8934,
            conversions: 234,
            conversionRate: 2.62,
            status: 'active'
          },
          {
            id: generateId(),
            name: 'Página de Cards',
            url: 'https://axionstore.com/cards?ref=AXUSER123',
            clicks: 2345,
            conversions: 67,
            conversionRate: 2.86,
            status: 'active'
          },
          {
            id: generateId(),
            name: 'Página de Bots',
            url: 'https://axionstore.com/bots?ref=AXUSER123',
            clicks: 1178,
            conversions: 46,
            conversionRate: 3.90,
            status: 'active'
          }
        ]
      },
      
      payments: [
        {
          id: generateId(),
          amount: 1500.00,
          method: 'pix',
          status: 'completed',
          requestedAt: now - 1000 * 60 * 60 * 24 * 7,
          processedAt: now - 1000 * 60 * 60 * 24 * 6,
          reference: `AFF${Date.now() - 604800000}`
        },
        {
          id: generateId(),
          amount: 875.50,
          method: 'bank_transfer',
          status: 'completed',
          requestedAt: now - 1000 * 60 * 60 * 24 * 14,
          processedAt: now - 1000 * 60 * 60 * 24 * 13,
          reference: `AFF${Date.now() - 1209600000}`
        }
      ]
    }
  }

  // Salvar dados do afiliado no localStorage
  saveAffiliateData(userId, data) {
    const key = `affiliate_${userId}`
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  }

  // Carregar dados do afiliado do localStorage
  loadAffiliateData(userId) {
    const key = `affiliate_${userId}`
    const stored = localStorage.getItem(key)
    
    if (!stored) return null
    
    const { data, timestamp } = JSON.parse(stored)
    
    // Verificar se os dados são muito antigos (mais de 6h)
    if (Date.now() - timestamp > 6 * 60 * 60 * 1000) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
  }

  async getAffiliateProfile(userId) {
    const cacheKey = `affiliate_profile_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAffiliateData(userId)
    if (storedData && storedData.profile) {
      this.cache.set(cacheKey, {
        data: storedData.profile,
        timestamp: Date.now()
      })
      return storedData.profile
    }

    const affiliateData = this.generateAffiliateData(userId)
    this.saveAffiliateData(userId, affiliateData)
    
    this.cache.set(cacheKey, {
      data: affiliateData.profile,
      timestamp: Date.now()
    })
    
    return affiliateData.profile
  }

  async getAffiliateStats(userId) {
    const cacheKey = `affiliate_stats_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAffiliateData(userId)
    if (storedData && storedData.stats) {
      this.cache.set(cacheKey, {
        data: storedData.stats,
        timestamp: Date.now()
      })
      return storedData.stats
    }

    const affiliateData = this.generateAffiliateData(userId)
    this.saveAffiliateData(userId, affiliateData)
    
    this.cache.set(cacheKey, {
      data: affiliateData.stats,
      timestamp: Date.now()
    })
    
    return affiliateData.stats
  }

  async getReferrals(userId) {
    const cacheKey = `affiliate_referrals_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAffiliateData(userId)
    if (storedData && storedData.referrals) {
      this.cache.set(cacheKey, {
        data: storedData.referrals,
        timestamp: Date.now()
      })
      return storedData.referrals
    }

    const affiliateData = this.generateAffiliateData(userId)
    this.saveAffiliateData(userId, affiliateData)
    
    this.cache.set(cacheKey, {
      data: affiliateData.referrals,
      timestamp: Date.now()
    })
    
    return affiliateData.referrals
  }

  async getCommissions(userId) {
    const cacheKey = `affiliate_commissions_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAffiliateData(userId)
    if (storedData && storedData.commissions) {
      this.cache.set(cacheKey, {
        data: storedData.commissions,
        timestamp: Date.now()
      })
      return storedData.commissions
    }

    const affiliateData = this.generateAffiliateData(userId)
    this.saveAffiliateData(userId, affiliateData)
    
    this.cache.set(cacheKey, {
      data: affiliateData.commissions,
      timestamp: Date.now()
    })
    
    return affiliateData.commissions
  }

  async getMarketingLinks(userId) {
    const cacheKey = `affiliate_links_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAffiliateData(userId)
    if (storedData && storedData.marketing) {
      this.cache.set(cacheKey, {
        data: storedData.marketing,
        timestamp: Date.now()
      })
      return storedData.marketing
    }

    const affiliateData = this.generateAffiliateData(userId)
    this.saveAffiliateData(userId, affiliateData)
    
    this.cache.set(cacheKey, {
      data: affiliateData.marketing,
      timestamp: Date.now()
    })
    
    return affiliateData.marketing
  }

  async getPaymentHistory(userId) {
    const cacheKey = `affiliate_payments_${userId}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const storedData = this.loadAffiliateData(userId)
    if (storedData && storedData.payments) {
      this.cache.set(cacheKey, {
        data: storedData.payments,
        timestamp: Date.now()
      })
      return storedData.payments
    }

    const affiliateData = this.generateAffiliateData(userId)
    this.saveAffiliateData(userId, affiliateData)
    
    this.cache.set(cacheKey, {
      data: affiliateData.payments,
      timestamp: Date.now()
    })
    
    return affiliateData.payments
  }

  // Ações do afiliado
  async createMarketingLink(userId, linkData) {
    const storedData = this.loadAffiliateData(userId) || this.generateAffiliateData(userId)
    
    const newLink = {
      id: generateId(),
      ...linkData,
      clicks: 0,
      conversions: 0,
      conversionRate: 0,
      status: 'active',
      createdAt: Date.now()
    }
    
    storedData.marketing.links.push(newLink)
    storedData.marketing.totalLinks++
    storedData.marketing.activeLinks++
    
    this.saveAffiliateData(userId, storedData)
    this.clearCache()
    
    return newLink
  }

  async requestWithdrawal(userId, amount) {
    const storedData = this.loadAffiliateData(userId) || this.generateAffiliateData(userId)
    
    if (amount > storedData.profile.currentBalance) {
      throw new Error('Saldo insuficiente')
    }
    
    const withdrawal = {
      id: generateId(),
      amount,
      method: storedData.profile.paymentMethod,
      status: 'pending',
      requestedAt: Date.now(),
      processedAt: null,
      reference: `AFF${Date.now()}`
    }
    
    storedData.payments.unshift(withdrawal)
    storedData.profile.currentBalance -= amount
    
    this.saveAffiliateData(userId, storedData)
    this.clearCache()
    
    return withdrawal
  }

  async trackClick(userId, linkId) {
    const storedData = this.loadAffiliateData(userId) || this.generateAffiliateData(userId)
    
    const link = storedData.marketing.links.find(l => l.id === linkId)
    if (link) {
      link.clicks++
      storedData.stats.totalClicks++
      
      this.saveAffiliateData(userId, storedData)
    }
  }

  async trackConversion(userId, referralId, amount) {
    const storedData = this.loadAffiliateData(userId) || this.generateAffiliateData(userId)
    
    const commissionAmount = amount * (storedData.profile.commissionRate / 100)
    
    const commission = {
      id: generateId(),
      referralId,
      type: 'purchase',
      description: 'Nova conversão',
      amount,
      commissionRate: storedData.profile.commissionRate,
      commissionAmount,
      status: 'pending',
      timestamp: Date.now(),
      paidAt: null
    }
    
    storedData.commissions.unshift(commission)
    storedData.profile.totalEarned += commissionAmount
    storedData.profile.currentBalance += commissionAmount
    storedData.stats.totalConversions++
    storedData.stats.monthlyEarnings += commissionAmount
    
    this.saveAffiliateData(userId, storedData)
    this.clearCache()
    
    return commission
  }
}

export default new AffiliateService()