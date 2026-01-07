import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../Login'

// Mock do useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock do setTimeout
jest.useFakeTimers()

describe('Login Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
  })

  const renderLogin = () => {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
  }

  test('renderiza o formulário de login', () => {
    renderLogin()
    
    expect(screen.getByText('AXION')).toBeInTheDocument()
    expect(screen.getByText('STORE')).toBeInTheDocument()
    expect(screen.getByText('Entre na sua conta')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  test('atualiza o estado quando digitar nos campos', () => {
    renderLogin()
    
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } })
    
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  test('mostra/oculta senha quando clicar no ícone', () => {
    renderLogin()
    
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const toggleButton = screen.getByRole('button') // Botão de mostrar/ocultar senha
    
    // Inicialmente senha está oculta
    expect(passwordInput.type).toBe('password')
    
    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('text')
    
    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('password')
  })

  test('realiza login com sucesso', async () => {
    renderLogin()
    
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByText('Entrar')
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } })
    
    fireEvent.click(submitButton)
    
    // Verifica estado de loading
    expect(screen.getByText('Processando...')).toBeInTheDocument()
    
    // Avança o tempo para simular o login
    jest.advanceTimersByTime(1500)
    
    await waitFor(() => {
      expect(localStorage.getItem('isLoggedIn')).toBe('true')
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  test('salva informações do usuário no localStorage após login', async () => {
    renderLogin()
    
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByText('Entrar')
    
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } })
    
    fireEvent.click(submitButton)
    jest.advanceTimersByTime(1500)
    
    await waitFor(() => {
      const user = JSON.parse(localStorage.getItem('user'))
      expect(user.email).toBe('test@example.com')
      expect(user.name).toBe('Usuário Demo')
      expect(user.plan).toBe('free')
    })
  })

  test('navega para register quando clicar no link', () => {
    renderLogin()
    
    const registerLink = screen.getByText('Criar conta gratuita')
    fireEvent.click(registerLink)
    
    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })
})
