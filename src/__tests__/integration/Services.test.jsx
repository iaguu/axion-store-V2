import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Services from '../../components/Services'

// Mock do localDB
jest.mock('../../services/localDB', () => ({
  getCards: jest.fn(() => []),
  getAnalytics: jest.fn(() => ({
    totalCards: 0,
    activeCards: 0,
    conversions: 0,
    ctr: 0
  }))
}))

describe('Services Integration Tests', () => {
  const renderServices = () => {
    return render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    )
  }

  test('renderiza a seção de serviços', () => {
    renderServices()
    
    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getByText('Cards Inteligentes')).toBeInTheDocument()
  })

  test('exibe cards de serviço', () => {
    renderServices()
    
    expect(screen.getByText('Cards Personalizados')).toBeInTheDocument()
    expect(screen.getByText('Database Avançada')).toBeInTheDocument()
    expect(screen.getByText('Automação com IA')).toBeInTheDocument()
  })

  test('integração com localDB para获取 estatísticas', () => {
    const localDB = require('../../services/localDB')
    localDB.getAnalytics.mockReturnValue({
      totalCards: 10,
      activeCards: 8,
      conversions: 25,
      ctr: 3.5
    })
    
    renderServices()
    
    expect(localDB.getAnalytics).toHaveBeenCalled()
  })

  test('navegação para dashboard quando usuário logado', async () => {
    // Mock usuário logado
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify({
      id: 'demo_user_123',
      name: 'Usuário Demo',
      email: 'demo@example.com',
      plan: 'free'
    }))
    
    renderServices()
    
    const ctaButton = screen.getByText('Começar Agora')
    fireEvent.click(ctaButton)
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })
  })
})
