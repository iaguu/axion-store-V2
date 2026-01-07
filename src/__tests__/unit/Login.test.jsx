import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../components/Login'

describe('Login Component', () => {
  test('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('•••••••••')).toBeInTheDocument()
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  test('navigates to register page', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const registerButton = screen.getByText('Cadastre-se')
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/register')
    })
  })

  test('shows error for invalid credentials', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('•••••••••')
    const submitButton = screen.getByText('Entrar')

    fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid@email.com' } })
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'wrong' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
    })
  })
})
