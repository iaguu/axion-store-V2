import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminPanel from '../../components/AdminPanel'
import adminService from '../../services/adminService'
import adminAuthService from '../../services/adminAuthService'

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(() => 'true'), // isAdmin = true
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock dos serviços
jest.mock('../../services/adminService')
jest.mock('../../services/adminAuthService')
jest.mock('../../utils/crypto', () => ({
  generateId: () => 'test-id-123',
  formatCurrency: (value) => `R$ ${value.toFixed(2)}`,
  formatDate: (date) => new Date(date).toLocaleDateString('pt-BR')
}))

describe('AdminPanel Component', () => {
  const mockAdmin = { username: 'axion_admin_2024', email: 'admin@axionstore.com', role: 'admin' }
  const mockOverview = {
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 284750.50,
    monthlyRevenue: 47500.00,
    totalTransactions: 3421,
    conversionRate: 15.8,
    avgTicket: 83.20,
    churnRate: 2.3
  }

  beforeEach(() => {
    jest.clearAllMocks()
    adminAuthService.checkAuth.mockReturnValue(true)
    adminAuthService.user = mockAdmin
    adminAuthService.logout.mockImplementation(() => {})
    
    adminService.getOverview.mockResolvedValue(mockOverview)
    adminService.getUsers.mockResolvedValue([])
    adminService.getTransactions.mockResolvedValue([])
    adminService.getServices.mockResolvedValue([])
    adminService.getSecurityAlerts.mockResolvedValue({})
    adminService.getSystemStatus.mockResolvedValue({})
  })

  const renderAdminPanel = () => {
    return render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    )
  }

  test('renderiza o painel admin corretamente', async () => {
    renderAdminPanel()
    
    await waitFor(() => {
      expect(screen.getByText('Painel Administrativo')).toBeInTheDocument()
    })
  })

  test('exibe estatísticas gerais', async () => {
    renderAdminPanel()
    
    await waitFor(() => {
      expect(screen.getByText('1.247')).toBeInTheDocument() // totalUsers
      expect(screen.getByText('R$ 47.500,00')).toBeInTheDocument() // monthlyRevenue
      expect(screen.getByText('3.421')).toBeInTheDocument() // totalTransactions
      expect(screen.getByText('15.8%')).toBeInTheDocument() // conversionRate
    })
  })

  test('exibe menu de navegação admin', async () => {
    renderAdminPanel()
    
    await waitFor(() => {
      expect(screen.getByText('Visão Geral')).toBeInTheDocument()
      expect(screen.getByText('Usuários')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByText('Sistema')).toBeInTheDocument()
      expect(screen.getByText('Segurança')).toBeInTheDocument()
      expect(screen.getByText('Configurações')).toBeInTheDocument()
    })
  })

  test('permite navegar entre abas', async () => {
    renderAdminPanel()
    
    await waitFor(() => {
      expect(screen.getByText('Visão Geral')).toBeInTheDocument()
    })
    
    const usersTab = screen.getByText('Usuários')
    fireEvent.click(usersTab)
    
    await waitFor(() => {
      expect(screen.getByText('Usuários')).toHaveClass('text-yellow-500')
    })
  })

  test('verifica autenticação admin ao carregar', () => {
    adminAuthService.checkAuth.mockReturnValue(false)
    
    renderAdminPanel()
    
    expect(adminAuthService.checkAuth).toHaveBeenCalled()
  })

  test('permite fazer logout admin', async () => {
    const mockNavigate = jest.fn()
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }))

    renderAdminPanel()
    
    await waitFor(() => {
      const logoutButton = screen.getByRole('button', { name: /logout/i })
      fireEvent.click(logoutButton)
    })

    expect(adminAuthService.logout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('exibe loading state', () => {
    adminService.getOverview.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderAdminPanel()
    
    expect(screen.getByText('Carregando painel administrativo...')).toBeInTheDocument()
  })

  test('lida com erro de carregamento', async () => {
    adminService.getOverview.mockRejectedValue(new Error('Erro de conexão'))
    
    renderAdminPanel()
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível carregar os dados administrativos/)).toBeInTheDocument()
    })
  })

  test('permite gerar relatórios', async () => {
    const mockReport = {
      id: 'report-123',
      type: 'revenue',
      data: { totalRevenue: 284750.50 }
    }
    
    adminService.generateReport.mockResolvedValue(mockReport)
    
    renderAdminPanel()
    
    await waitFor(() => {
      // Simular clique no botão de gerar relatório
      const reportButton = screen.getByText('Gerar Relatório')
      fireEvent.click(reportButton)
    })
    
    expect(adminService.generateReport).toHaveBeenCalled()
  })

  test('permite ações em usuários', async () => {
    const mockUsers = [
      {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        status: 'active',
        plan: 'pro'
      }
    ]
    
    adminService.getUsers.mockResolvedValue(mockUsers)
    adminService.updateUserStatus.mockResolvedValue({ success: true })
    
    renderAdminPanel()
    
    // Navegar para aba de usuários
    await waitFor(() => {
      const usersTab = screen.getByText('Usuários')
      fireEvent.click(usersTab)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })
    
    // Simular ação de suspender usuário
    const suspendButton = screen.getByText('Suspender')
    fireEvent.click(suspendButton)
    
    expect(adminService.updateUserStatus).toHaveBeenCalledWith('user-1', 'suspended')
  })

  test('permite ações em transações', async () => {
    const mockTransactions = [
      {
        id: 'tx-1',
        userId: 'user-1',
        userName: 'Test User',
        amount: 500,
        status: 'pending',
        method: 'pix'
      }
    ]
    
    adminService.getTransactions.mockResolvedValue(mockTransactions)
    adminService.updateTransactionStatus.mockResolvedValue({ success: true })
    
    renderAdminPanel()
    
    // Navegar para aba de transações
    await waitFor(() => {
      const transactionsTab = screen.getByText('Analytics')
      fireEvent.click(transactionsTab)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument()
    })
    
    // Simular ação de aprovar transação
    const approveButton = screen.getByText('Aprovar')
    fireEvent.click(approveButton)
    
    expect(adminService.updateTransactionStatus).toHaveBeenCalledWith('tx-1', 'completed')
  })

  test('exibe alertas de segurança', async () => {
    const mockSecurity = {
      totalAlerts: 23,
      criticalAlerts: 2,
      blockedIps: 156,
      suspiciousLogins: 8
    }
    
    adminService.getSecurityAlerts.mockResolvedValue(mockSecurity)
    
    renderAdminPanel()
    
    // Navegar para aba de segurança
    await waitFor(() => {
      const securityTab = screen.getByText('Segurança')
      fireEvent.click(securityTab)
    })
    
    await waitFor(() => {
      expect(screen.getByText('23')).toBeInTheDocument() // totalAlerts
      expect(screen.getByText('2')).toBeInTheDocument() // criticalAlerts
      expect(screen.getByText('156')).toBeInTheDocument() // blockedIps
    })
  })

  test('exibe status do sistema', async () => {
    const mockSystem = {
      serverUptime: '99.98%',
      apiResponseTime: 145,
      databaseConnections: 89,
      storageUsed: '67.3%',
      bandwidthToday: '2.4TB',
      errorsLast24h: 3
    }
    
    adminService.getSystemStatus.mockResolvedValue(mockSystem)
    
    renderAdminPanel()
    
    // Navegar para aba de sistema
    await waitFor(() => {
      const systemTab = screen.getByText('Sistema')
      fireEvent.click(systemTab)
    })
    
    await waitFor(() => {
      expect(screen.getByText('99.98%')).toBeInTheDocument() // serverUptime
      expect(screen.getByText('145ms')).toBeInTheDocument() // apiResponseTime
      expect(screen.getByText('89')).toBeInTheDocument() // databaseConnections
    })
  })

  test('permite pesquisar usuários', async () => {
    renderAdminPanel()
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/buscar usuários/i)
      expect(searchInput).toBeInTheDocument()
      
      fireEvent.change(searchInput, { target: { value: 'Test User' } })
      expect(searchInput.value).toBe('Test User')
    })
  })

  test('exibe menu mobile responsivo', async () => {
    // Mock para tela pequena
    window.innerWidth = 500
    
    renderAdminPanel()
    
    await waitFor(() => {
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toBeInTheDocument()
    })
  })
})
