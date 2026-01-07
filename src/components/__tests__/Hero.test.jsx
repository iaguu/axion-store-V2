import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '../Hero'

// Mock do useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Hero Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    
    // Mock getElementById
    document.getElementById = jest.fn(() => ({
      scrollIntoView: jest.fn()
    }))
  })

  const renderHero = () => {
    return render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    )
  }

  test('renderiza o badge CARDS LIVE V2.0', () => {
    renderHero()
    
    expect(screen.getByText('CARDS LIVE V2.0')).toBeInTheDocument()
  })

  test('renderiza o título principal', () => {
    renderHero()
    
    expect(screen.getByText(/Cards Inteligentes/)).toBeInTheDocument()
    expect(screen.getByText(/Para E-commerce/)).toBeInTheDocument()
  })

  test('renderiza a descrição', () => {
    renderHero()
    
    expect(screen.getByText(/Sistema completo de cards/)).toBeInTheDocument()
  })

  test('renderiza os botões CTA', () => {
    renderHero()
    
    expect(screen.getByText('Começar Gratuitamente')).toBeInTheDocument()
    expect(screen.getByText('Ver Planos')).toBeInTheDocument()
  })

  test('navega para register quando clicar em Começar Gratuitamente', () => {
    renderHero()
    
    fireEvent.click(screen.getByText('Começar Gratuitamente'))
    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })

  test('rola para seção pricing quando clicar em Ver Planos', () => {
    renderHero()
    
    const mockElement = { scrollIntoView: jest.fn() }
    document.getElementById.mockReturnValue(mockElement)
    
    fireEvent.click(screen.getByText('Ver Planos'))
    expect(document.getElementById).toHaveBeenCalledWith('pricing')
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  test('renderiza as estatísticas', () => {
    renderHero()
    
    expect(screen.getByText('98%')).toBeInTheDocument()
    expect(screen.getByText('Taxa de Satisfação')).toBeInTheDocument()
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Clientes Ativos')).toBeInTheDocument()
  })
})
