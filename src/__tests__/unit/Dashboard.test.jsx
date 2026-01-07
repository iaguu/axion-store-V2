import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../../components/Dashboard'
import dashboardService from '../../services/dashboardService'

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(() => JSON.stringify({ id: 'test-user', name: 'Test User' })),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock do dashboardService
jest.mock('../../services/dashboardService')
jest.mock('../../utils/crypto', () => ({
  generateId: () => 'test-id-123',
  formatCurrency: (value) => `R$ ${value.toFixed(2)}`,
  formatDate: (date) => new Date(date).toLocaleDateString('pt-BR')
}))

describe('Dashboard Component', () => {
  const mockUser = { id: 'test-user', name: 'Test User' }
  const mockStats = {
    totalTransactions: 47,
    totalCards: 12,
    totalBots: 5,
    totalQueries: 234,
    monthlyRevenue: 8750.50,
    activeSubscriptions: 3,
    conversionRate: 12.5,
    avgTicket: 186.20
  }

  beforeEach(() => {
    jest.clearAllMocks()
    dashboardService.getUserStats.mockResolvedValue(mockStats)
    dashboardService.getRecentActivities.mockResolvedValue([])
    dashboardService.getUserCards.mockResolvedValue([])
    dashboardService.getUserBots.mockResolvedValue([])
    dashboardService.getUserTransactions.mockResolvedValue([])
    dashboardService.getUserQueries.mockResolvedValue([])
  })

  const renderDashboard = () => {
    return render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )
  }

  test('renderiza o dashboard corretamente', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText('Visão Geral')).toBeInTheDocument()
    })
  })

  test('exibe estatísticas do usuário', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText('47')).toBeInTheDocument() // totalTransactions
      expect(screen.getByText('12')).toBeInTheDocument() // totalCards
      expect(screen.getByText('5')).toBeInTheDocument() // totalBots
      expect(screen.getByText('234')).toBeInTheDocument() // totalQueries
    })
  })

  test('exibe menu de navegação', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText('Visão Geral')).toBeInTheDocument()
      expect(screen.getByText('Catálogo')).toBeInTheDocument()
      expect(screen.getByText('Cards')).toBeInTheDocument()
      expect(screen.getByText('Bots')).toBeInTheDocument()
      expect(screen.getByText('Consultas')).toBeInTheDocument()
      expect(screen.getByText('VIP Premium')).toBeInTheDocument()
      expect(screen.getByText('Ferramentas')).toBeInTheDocument()
      expect(screen.getByText('IA Tools')).toBeInTheDocument()
      expect(screen.getByText('Servidor')).toBeInTheDocument()
      expect(screen.getByText('Configurações')).toBeInTheDocument()
    })
  })

  test('permite navegar entre abas', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText('Visão Geral')).toBeInTheDocument()
    })
    
    const catalogTab = screen.getByText('Catálogo')
    fireEvent.click(catalogTab)
    
    await waitFor(() => {
      expect(screen.getByText('Catálogo')).toHaveClass('text-yellow-500')
    })
  })

  test('exibe botão de refresh', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
    })
  })

  test('permite fazer logout', async () => {
    const mockNavigate = jest.fn()
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }))

    renderDashboard()
    
    await waitFor(() => {
      const logoutButton = screen.getByRole('button', { name: /logout/i })
      fireEvent.click(logoutButton)
    })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('isLoggedIn')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
  })

  test('exibe loading state', () => {
    dashboardService.getUserStats.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderDashboard()
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  test('lida com erro de carregamento', async () => {
    dashboardService.getUserStats.mockRejectedValue(new Error('Erro de conexão'))
    
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar seus dados/)).toBeInTheDocument()
    })
  })

  test('inicializa dados de exemplo quando necessário', async () => {
    dashboardService.getUserStats.mockResolvedValue({ totalTransactions: 0 })
    dashboardService.initializeSampleData.mockResolvedValue(mockStats)
    
    renderDashboard()
    
    await waitFor(() => {
      expect(dashboardService.initializeSampleData).toHaveBeenCalledWith('test-user')
    })
  })

  test('exibe atividades recentes quando disponíveis', async () => {
    const mockActivities = [
      {
        id: '1',
        type: 'purchase',
        title: 'Novo card adquirido',
        description: 'Card Visa **** 4532 - R$ 500',
        timestamp: Date.now() - 1000 * 60 * 15,
        status: 'completed',
        amount: 500
      }
    ]
    
    dashboardService.getRecentActivities.mockResolvedValue(mockActivities)
    
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText('Novo card adquirido')).toBeInTheDocument()
      expect(screen.getByText('Card Visa **** 4532 - R$ 500')).toBeInTheDocument()
    })
  })

  test('permite pesquisar', async () => {
    renderDashboard()
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/buscar/i)
      expect(searchInput).toBeInTheDocument()
      
      fireEvent.change(searchInput, { target: { value: 'test search' } })
      expect(searchInput.value).toBe('test search')
    })
  })

  test('exibe menu mobile responsivo', async () => {
    // Mock para tela pequena
    window.innerWidth = 500
    
    renderDashboard()
    
    await waitFor(() => {
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toBeInTheDocument()
    })
  })
})
