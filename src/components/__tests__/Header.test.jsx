import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../Header'

// Mock do useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock do scrollTo
global.scrollTo = jest.fn()

describe('Header Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
    
    // Mock getElementById
    document.getElementById = jest.fn(() => ({
      scrollIntoView: jest.fn()
    }))
  })

  const renderHeader = (props = {}) => {
    const defaultProps = {
      mobileMenuOpen: false,
      setMobileMenuOpen: jest.fn(),
    }
    
    return render(
      <MemoryRouter>
        <Header {...defaultProps} {...props} />
      </MemoryRouter>
    )
  }

  test('renderiza o logo e o nome da empresa', () => {
    renderHeader()
    
    expect(screen.getByText('AXION')).toBeInTheDocument()
    expect(screen.getByText('STORE')).toBeInTheDocument()
    expect(screen.getByText('>')).toBeInTheDocument()
  })

  test('renderiza os links de navegação desktop', () => {
    renderHeader()
    
    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getByText('Preços')).toBeInTheDocument()
    expect(screen.getByText('Prova Social')).toBeInTheDocument()
    expect(screen.getByText('Contato')).toBeInTheDocument()
  })

  test('renderiza botões de login e get started', () => {
    renderHeader()
    
    expect(screen.getByText('Entrar')).toBeInTheDocument()
    expect(screen.getByText('Começar')).toBeInTheDocument()
  })

  test('navega para login quando clicar em Entrar', () => {
    renderHeader()
    
    fireEvent.click(screen.getByText('Entrar'))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  test('navega para register quando clicar em Começar', () => {
    renderHeader()
    
    fireEvent.click(screen.getByText('Começar'))
    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })

  test('chama scrollToSection quando clicar nos links de navegação', () => {
    const mockSetMobileMenuOpen = jest.fn()
    renderHeader({ setMobileMenuOpen: mockSetMobileMenuOpen })
    
    const mockElement = { scrollIntoView: jest.fn() }
    document.getElementById.mockReturnValue(mockElement)
    
    fireEvent.click(screen.getByText('Serviços'))
    expect(document.getElementById).toHaveBeenCalledWith('services')
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(mockSetMobileMenuOpen).toHaveBeenCalledWith(false)
  })
})
