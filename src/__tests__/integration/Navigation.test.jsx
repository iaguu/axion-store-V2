import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

// Mock do useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock do scrollTo
global.scrollTo = jest.fn()

// Mock do getElementById
document.getElementById = jest.fn(() => ({
  scrollIntoView: jest.fn()
}))

describe('Navegação Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null)
  })

  const renderApp = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    )
  }

  test('navega da landing page para login', async () => {
    renderApp()
    
    const loginButton = screen.getByText('Entrar')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Entre na sua conta')).toBeInTheDocument()
    })
  })

  test('navega da landing page para registro', async () => {
    renderApp()
    
    const getStartedButton = screen.getByText('Começar')
    fireEvent.click(getStartedButton)
    
    await waitFor(() => {
      expect(screen.getByText('Criar sua conta')).toBeInTheDocument()
    })
  })

  test('navega do header para diferentes seções', () => {
    renderApp()
    
    const servicesButton = screen.getByText('Serviços')
    fireEvent.click(servicesButton)
    
    expect(document.getElementById).toHaveBeenCalledWith('services')
  })

  test('fluxo completo de login', async () => {
    renderApp()
    
    // Navegar para login
    const loginButton = screen.getByText('Entrar')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Entre na sua conta')).toBeInTheDocument()
    })
    
    // Preencher formulário
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByText('Entrar')
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'demo@axionstore.com' } })
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'demo123' } })
    
    fireEvent.click(submitButton)
    
    // Simular tempo de login
    jest.advanceTimersByTime(1500)
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isLoggedIn', 'true')
    })
  })

  test('fluxo de registro', async () => {
    renderApp()
    
    // Navegar para registro
    const getStartedButton = screen.getByText('Começar')
    fireEvent.click(getStartedButton)
    
    await waitFor(() => {
      expect(screen.getByText('Criar sua conta')).toBeInTheDocument()
    })
    
    // Verificar campos do formulário
    expect(screen.getByPlaceholderText('Seu nome completo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  test('acesso ao dashboard após login', async () => {
    // Mock usuário logado
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true'
      if (key === 'user') return JSON.stringify({
        id: 'demo_user_123',
        name: 'Usuário Demo',
        email: 'demo@example.com',
        plan: 'free'
      })
      return null
    })
    
    renderApp()
    
    // Navegar diretamente para dashboard
    window.history.pushState({}, '', '/dashboard')
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })

  test('navegação no menu do dashboard', async () => {
    // Mock usuário logado
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true'
      if (key === 'user') return JSON.stringify({
        id: 'demo_user_123',
        name: 'Usuário Demo',
        email: 'demo@example.com',
        plan: 'free'
      })
      return null
    })
    
    renderApp()
    
    // Navegar para dashboard
    window.history.pushState({}, '', '/dashboard')
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
    
    // Testar navegação no menu lateral
    const cardsLink = screen.getByText('Meus Cards')
    fireEvent.click(cardsLink)
    
    expect(screen.getByText('Gerenciar seus Cards')).toBeInTheDocument()
  })

  test('acesso ao painel administrativo', async () => {
    renderApp()
    
    // Navegar para admin
    window.history.pushState({}, '', '/admin')
    
    await waitFor(() => {
      expect(screen.getByText('Painel Administrativo')).toBeInTheDocument()
    })
  })

  test('logout do dashboard', async () => {
    // Mock usuário logado
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'isLoggedIn') return 'true'
      if (key === 'user') return JSON.stringify({
        id: 'demo_user_123',
        name: 'Usuário Demo',
        email: 'demo@example.com',
        plan: 'free'
      })
      return null
    })
    
    renderApp()
    
    // Navegar para dashboard
    window.history.pushState({}, '', '/dashboard')
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
    
    // Realizar logout
    const logoutButton = screen.getByText('Sair')
    fireEvent.click(logoutButton)
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('isLoggedIn')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
  })
})
