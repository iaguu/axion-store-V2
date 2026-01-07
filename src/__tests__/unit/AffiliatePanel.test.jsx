import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AffiliatePanel from '../../components/AffiliatePanel'
import affiliateService from '../../services/affiliateService'

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(() => JSON.stringify({ id: 'test-user', name: 'Test User' })),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock do serviço
jest.mock('../../services/affiliateService')
jest.mock('../../utils/crypto', () => ({
  generateId: () => 'test-id-123',
  formatCurrency: (value) => `R$ ${value.toFixed(2)}`,
  formatDate: (date) => new Date(date).toLocaleDateString('pt-BR')
}))

describe('AffiliatePanel Component', () => {
  const mockProfile = {
    id: 'affiliate_test-user',
    userId: 'test-user',
    affiliateCode: 'AXTESTUSER',
    status: 'active',
    tier: 'gold',
    commissionRate: 15,
    totalEarned: 12475.50,
    currentBalance: 2340.75,
    totalWithdrawn: 10134.75,
    paymentMethod: 'pix',
    pixKey: 'affiliate@axionstore.com'
  }

  const mockStats = {
    totalClicks: 12457,
    totalConversions: 347,
    conversionRate: 2.79,
    avgCommission: 35.95,
    monthlyEarnings: 2847.50,
    lastMonthEarnings: 2156.25,
    growth: 32.1
  }

  beforeEach(() => {
    jest.clearAllMocks()
    affiliateService.getAffiliateProfile.mockResolvedValue(mockProfile)
    affiliateService.getAffiliateStats.mockResolvedValue(mockStats)
    affiliateService.getReferrals.mockResolvedValue([])
    affiliateService.getCommissions.mockResolvedValue([])
    affiliateService.getMarketingLinks.mockResolvedValue({})
    affiliateService.getPaymentHistory.mockResolvedValue([])
  })

  const renderAffiliatePanel = () => {
    return render(
      <MemoryRouter>
        <AffiliatePanel />
      </MemoryRouter>
    )
  }

  test('renderiza o painel afiliado corretamente', async () => {
    renderAffiliatePanel()
    
    await waitFor(() => {
      expect(screen.getByText('Painel de Afiliado')).toBeInTheDocument()
    })
  })

  test('exibe informações do perfil afiliado', async () => {
    renderAffiliatePanel()
    
    await waitFor(() => {
      expect(screen.getByText('AXTESTUSER')).toBeInTheDocument() // affiliateCode
      expect(screen.getByText('Gold')).toBeInTheDocument() // tier
      expect(screen.getByText('15%')).toBeInTheDocument() // commissionRate
      expect(screen.getByText('R$ 2.340,75')).toBeInTheDocument() // currentBalance
      expect(screen.getByText('R$ 12.475,50')).toBeInTheDocument() // totalEarned
    })
  })

  test('exibe estatísticas de desempenho', async () => {
    renderAffiliatePanel()
    
    await waitFor(() => {
      expect(screen.getByText('12.457')).toBeInTheDocument() // totalClicks
      expect(screen.getByText('347')).toBeInTheDocument() // totalConversions
      expect(screen.getByText('2.79%')).toBeInTheDocument() // conversionRate
      expect(screen.getByText('R$ 2.847,50')).toBeInTheDocument() // monthlyEarnings
      expect(screen.getByText('32.1%')).toBeInTheDocument() // growth
    })
  })

  test('exibe menu de navegação afiliado', async () => {
    renderAffiliatePanel()
    
    await waitFor(() => {
      expect(screen.getByText('Visão Geral')).toBeInTheDocument()
      expect(screen.getByText('Indicações')).toBeInTheDocument()
      expect(screen.getByText('Comissões')).toBeInTheDocument()
      expect(screen.getByText('Marketing')).toBeInTheDocument()
      expect(screen.getByText('Pagamentos')).toBeInTheDocument()
      expect(screen.getByText('Configurações')).toBeInTheDocument()
    })
  })

  test('permite navegar entre abas', async () => {
    renderAffiliatePanel()
    
    await waitFor(() => {
      expect(screen.getByText('Visão Geral')).toBeInTheDocument()
    })
    
    const referralsTab = screen.getByText('Indicações')
    fireEvent.click(referralsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Indicações')).toHaveClass('text-yellow-500')
    })
  })

  test('exibe lista de indicações quando disponível', async () => {
    const mockReferrals = [
      {
        id: 'ref-1',
        name: 'João Silva',
        email: 'joao@email.com',
        plan: 'pro',
        status: 'active',
        totalSpent: 1250.50,
        commissionEarned: 187.58
      }
    ]
    
    affiliateService.getReferrals.mockResolvedValue(mockReferrals)
    
    renderAffiliatePanel()
    
    // Navegar para aba de indicações
    await waitFor(() => {
      const referralsTab = screen.getByText('Indicações')
      fireEvent.click(referralsTab)
    })
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('joao@email.com')).toBeInTheDocument()
      expect(screen.getByText('Pro')).toBeInTheDocument()
      expect(screen.getByText('R$ 187,58')).toBeInTheDocument()
    })
  })

  test('exibe lista de comissões quando disponível', async () => {
    const mockCommissions = [
      {
        id: 'comm-1',
        referralName: 'João Silva',
        type: 'purchase',
        description: 'Card Visa **** 4532',
        amount: 500,
        commissionAmount: 75,
        status: 'paid'
      }
    ]
    
    affiliateService.getCommissions.mockResolvedValue(mockCommissions)
    
    renderAffiliatePanel()
    
    // Navegar para aba de comissões
    await waitFor(() => {
      const commissionsTab = screen.getByText('Comissões')
      fireEvent.click(commissionsTab)
    })
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('Card Visa **** 4532')).toBeInTheDocument()
      expect(screen.getByText('R$ 75,00')).toBeInTheDocument()
      expect(screen.getByText('Pago')).toBeInTheDocument()
    })
  })

  test('permite solicitar saque', async () => {
    const mockWithdrawal = {
      id: 'withdraw-1',
      amount: 500,
      method: 'pix',
      status: 'pending',
      reference: 'AFF1234567890'
    }
    
    affiliateService.requestWithdrawal.mockResolvedValue(mockWithdrawal)
    
    renderAffiliatePanel()
    
    await waitFor(() => {
      const withdrawButton = screen.getByText('Solicitar Saque')
      expect(withdrawButton).toBeInTheDocument()
      
      fireEvent.click(withdrawButton)
    })
    
    // Preencher formulário de saque
    await waitFor(() => {
      const amountInput = screen.getByPlaceholderText(/valor do saque/i)
      expect(amountInput).toBeInTheDocument()
      
      fireEvent.change(amountInput, { target: { value: '500' } })
      
      const confirmButton = screen.getByText('Confirmar Saque')
      fireEvent.click(confirmButton)
    })
    
    expect(affiliateService.requestWithdrawal).toHaveBeenCalledWith('test-user', 500)
  })

  test('exibe links de marketing quando disponível', async () => {
    const mockMarketing = {
      totalLinks: 5,
      activeLinks: 3,
      links: [
        {
          id: 'link-1',
          name: 'Landing Page Principal',
          url: 'https://axionstore.com?ref=AXTESTUSER',
          clicks: 8934,
          conversions: 234,
          conversionRate: 2.62,
          status: 'active'
        }
      ]
    }
    
    affiliateService.getMarketingLinks.mockResolvedValue(mockMarketing)
    
    renderAffiliatePanel()
    
    // Navegar para aba de marketing
    await waitFor(() => {
      const marketingTab = screen.getByText('Marketing')
      fireEvent.click(marketingTab)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Landing Page Principal')).toBeInTheDocument()
      expect(screen.getByText('https://axionstore.com?ref=AXTESTUSER')).toBeInTheDocument()
      expect(screen.getByText('8.934')).toBeInTheDocument() // clicks
      expect(screen.getByText('234')).toBeInTheDocument() // conversions
      expect(screen.getByText('2.62%')).toBeInTheDocument() // conversionRate
    })
  })

  test('permite criar novo link de marketing', async () => {
    const mockNewLink = {
      id: 'link-new',
      name: 'Novo Link Teste',
      url: 'https://axionstore.com/test?ref=AXTESTUSER',
      clicks: 0,
      conversions: 0,
      status: 'active'
    }
    
    affiliateService.createMarketingLink.mockResolvedValue(mockNewLink)
    
    renderAffiliatePanel()
    
    // Navegar para aba de marketing
    await waitFor(() => {
      const marketingTab = screen.getByText('Marketing')
      fireEvent.click(marketingTab)
    })
    
    await waitFor(() => {
      const createButton = screen.getByText('Criar Novo Link')
      fireEvent.click(createButton)
    })
    
    // Preencher formulário de novo link
    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText(/nome do link/i)
      const urlInput = screen.getByPlaceholderText(/url do link/i)
      
      fireEvent.change(nameInput, { target: { value: 'Novo Link Teste' } })
      fireEvent.change(urlInput, { target: { value: 'https://axionstore.com/test' } })
      
      const saveButton = screen.getByText('Salvar Link')
      fireEvent.click(saveButton)
    })
    
    expect(affiliateService.createMarketingLink).toHaveBeenCalledWith('test-user', {
      name: 'Novo Link Teste',
      url: 'https://axionstore.com/test'
    })
  })

  test('exibe histórico de pagamentos quando disponível', async () => {
    const mockPayments = [
      {
        id: 'payment-1',
        amount: 1500.00,
        method: 'pix',
        status: 'completed',
        reference: 'AFF1234567890'
      }
    ]
    
    affiliateService.getPaymentHistory.mockResolvedValue(mockPayments)
    
    renderAffiliatePanel()
    
    // Navegar para aba de pagamentos
    await waitFor(() => {
      const paymentsTab = screen.getByText('Pagamentos')
      fireEvent.click(paymentsTab)
    })
    
    await waitFor(() => {
      expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument()
      expect(screen.getByText('PIX')).toBeInTheDocument()
      expect(screen.getByText('Concluído')).toBeInTheDocument()
      expect(screen.getByText('AFF1234567890')).toBeInTheDocument()
    })
  })

  test('exibe loading state', () => {
    affiliateService.getAffiliateProfile.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderAffiliatePanel()
    
    expect(screen.getByText('Carregando painel de afiliado...')).toBeInTheDocument()
  })

  test('lida com erro de carregamento', async () => {
    affiliateService.getAffiliateProfile.mockRejectedValue(new Error('Erro de conexão'))
    
    renderAffiliatePanel()
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar seus dados/)).toBeInTheDocument()
    })
  })

  test('permite copiar código de afiliado', async () => {
    renderAffiliatePanel()
    
    await waitFor(() => {
      const copyButton = screen.getByText('Copiar Código')
      expect(copyButton).toBeInTheDocument()
      
      fireEvent.click(copyButton)
    })
    
    // Verificar se o código foi copiado para o clipboard
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('AXTESTUSER')
  })

  test('exibe menu mobile responsivo', async () => {
    // Mock para tela pequena
    window.innerWidth = 500
    
    renderAffiliatePanel()
    
    await waitFor(() => {
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toBeInTheDocument()
    })
  })
})
