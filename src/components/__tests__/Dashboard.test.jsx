import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'

// Mock do useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    
    // Mock localStorage para simular usuário logado
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify({
      id: 'demo_user_123',
      name: 'Usuário Demo',
      email: 'demo@example.com',
      plan: 'free'
    }))
  })

  const renderDashboard = () => {
    return render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )
  }

  test('renderiza o dashboard com informações do usuário', () => {
    renderDashboard()
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Usuário Demo')).toBeInTheDocument()
    expect(screen.getByText('demo@example.com')).toBeInTheDocument()
  })

  test('renderiza o menu lateral', () => {
    renderDashboard()
    
    expect(screen.getByText('Visão Geral')).toBeInTheDocument()
    expect(screen.getByText('Meus Cards')).toBeInTheDocument()
    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('Bots')).toBeInTheDocument()
    expect(screen.getByText('IA Tools')).toBeInTheDocument()
    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })

  test('renderiza as estatísticas principais', () => {
    renderDashboard()
    
    expect(screen.getByText('Cards Ativos')).toBeInTheDocument()
    expect(screen.getByText('Conversões')).toBeInTheDocument()
    expect(screen.getByText('Taxa CTR')).toBeInTheDocument()
    expect(screen.getByText('Receita')).toBeInTheDocument()
  })

  test('navega para diferentes seções do menu', () => {
    renderDashboard()
    
    const cardsLink = screen.getByText('Meus Cards')
    fireEvent.click(cardsLink)
    
    // Verifica se a seção de cards é exibida
    expect(screen.getByText('Gerenciar seus Cards')).toBeInTheDocument()
  })

  test('realiza logout corretamente', () => {
    renderDashboard()
    
    const logoutButton = screen.getByText('Sair')
    fireEvent.click(logoutButton)
    
    expect(localStorage.getItem('isLoggedIn')).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('mostra informações do plano do usuário', () => {
    renderDashboard()
    
    expect(screen.getByText('Plano Free')).toBeInTheDocument()
  })

  test('renderiza quick actions', () => {
    renderDashboard()
    
    expect(screen.getByText('Criar Novo Card')).toBeInTheDocument()
    expect(screen.getByText('Ver Analytics')).toBeInTheDocument()
    expect(screen.getByText('Upgrade Plano')).toBeInTheDocument()
  })
})
