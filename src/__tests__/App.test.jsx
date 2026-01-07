import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('App Component', () => {
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

  test('renderiza a landing page na rota raiz', () => {
    renderApp(['/'])
    
    expect(screen.getByText('AXION')).toBeInTheDocument()
    expect(screen.getByText('STORE')).toBeInTheDocument()
    expect(screen.getByText('CARDS LIVE V2.0')).toBeInTheDocument()
  })

  test('renderiza a página de login na rota /login', () => {
    renderApp(['/login'])
    
    expect(screen.getByText('Entre na sua conta')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
  })

  test('renderiza a página de registro na rota /register', () => {
    renderApp(['/register'])
    
    expect(screen.getByText('Criar sua conta')).toBeInTheDocument()
  })

  test('renderiza o dashboard na rota /dashboard', () => {
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
    
    renderApp(['/dashboard'])
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  test('renderiza o painel admin na rota /admin', () => {
    renderApp(['/admin'])
    
    expect(screen.getByText('Painel Administrativo')).toBeInTheDocument()
  })

  test('renderiza a página de sucesso na rota /payment-success', () => {
    renderApp(['/payment-success'])
    
    expect(screen.getByText('Pagamento Confirmado!')).toBeInTheDocument()
  })

  test('renderiza o painel afiliado na rota /affiliate', () => {
    renderApp(['/affiliate'])
    
    expect(screen.getByText('Painel de Afiliado')).toBeInTheDocument()
  })

  test('contém todas as rotas principais', () => {
    renderApp(['/'])
    
    // Verifica se os componentes principais estão presentes na landing page
    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getByText('Preços')).toBeInTheDocument()
    expect(screen.getByText('Prova Social')).toBeInTheDocument()
    expect(screen.getByText('Contato')).toBeInTheDocument()
  })
})
