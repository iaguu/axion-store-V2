import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Services from '../../components/Services'

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('Services Component', () => {
  const renderServices = () => {
    return render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window.location.href
    delete window.location
    window.location = { href: '' }
  })

  test('renderiza a seção de serviços corretamente', () => {
    renderServices()
    
    expect(screen.getByText('Nossos Serviços')).toBeInTheDocument()
    expect(screen.getByText('Tudo que você precisa para dominar o universo digital')).toBeInTheDocument()
  })

  test('exibe o banner de upsell', () => {
    renderServices()
    
    expect(screen.getByText('OFERTA IMPERDÍVEL')).toBeInTheDocument()
    expect(screen.getByText(/Pacote Premium completo com TODOS os serviços por apenas/)).toBeInTheDocument()
    expect(screen.getByText('R$ 997/mês')).toBeInTheDocument()
    expect(screen.getByText('Economia de R$ 3.000+')).toBeInTheDocument()
    expect(screen.getByText('Acesso Vitalício')).toBeInTheDocument()
  })

  test('renderiza todos os 8 serviços', () => {
    renderServices()
    
    const services = [
      'Cards Marketplace',
      'Database Search', 
      'Black Development',
      'Bots & Automação',
      'IA Tools',
      'Infraestrutura',
      'Segurança',
      'AxionPay'
    ]
    
    services.forEach(service => {
      expect(screen.getByText(service)).toBeInTheDocument()
    })
  })

  test('abre modal de upsell ao clicar em um serviço', async () => {
    renderServices()
    
    const cardsMarketplace = screen.getByText('Cards Marketplace')
    fireEvent.click(cardsMarketplace)
    
    await waitFor(() => {
      expect(screen.getByText('Escolha seu plano Cards Marketplace')).toBeInTheDocument()
    })
  })

  test('exibe planos corretamente no modal', async () => {
    renderServices()
    
    const cardsMarketplace = screen.getByText('Cards Marketplace')
    fireEvent.click(cardsMarketplace)
    
    await waitFor(() => {
      expect(screen.getByText('Básico')).toBeInTheDocument()
      expect(screen.getByText('Profissional')).toBeInTheDocument()
      expect(screen.getByText('Enterprise')).toBeInTheDocument()
      expect(screen.getByText('R$ 97/mês')).toBeInTheDocument()
      expect(screen.getByText('R$ 297/mês')).toBeInTheDocument()
      expect(screen.getByText('R$ 997/mês')).toBeInTheDocument()
    })
  })

  test('marca plano pro como mais popular', async () => {
    renderServices()
    
    const cardsMarketplace = screen.getByText('Cards Marketplace')
    fireEvent.click(cardsMarketplace)
    
    await waitFor(() => {
      expect(screen.getByText('MAIS POPULAR')).toBeInTheDocument()
    })
  })

  test('exibe upsell adicional no modal', async () => {
    renderServices()
    
    const cardsMarketplace = screen.getByText('Cards Marketplace')
    fireEvent.click(cardsMarketplace)
    
    await waitFor(() => {
      expect(screen.getByText('🚀 UPGRADE EXCLUSIVO')).toBeInTheDocument()
      expect(screen.getByText(/Adicione o plano Cards Marketplace ao PACOTE COMPLETO/)).toBeInTheDocument()
      expect(screen.getByText('ADICIONAR AO PACOTE')).toBeInTheDocument()
    })
  })

  test('redireciona para checkout ao selecionar plano', async () => {
    renderServices()
    
    const cardsMarketplace = screen.getByText('Cards Marketplace')
    fireEvent.click(cardsMarketplace)
    
    await waitFor(() => {
      const basicPlanButton = screen.getByText('Começar')
      fireEvent.click(basicPlanButton)
    })
    
    expect(window.location.href).toContain('/checkout?service=1&plan=basic')
  })

  test('redireciona para pacote completo ao clicar no banner', () => {
    renderServices()
    
    const packageButton = screen.getByText('QUERO O PACOTE COMPLETO')
    fireEvent.click(packageButton)
    
    expect(window.location.href).toContain('/checkout?service=all&plan=premium')
  })

  test('fecha modal ao clicar no X', async () => {
    renderServices()
    
    const cardsMarketplace = screen.getByText('Cards Marketplace')
    fireEvent.click(cardsMarketplace)
    
    await waitFor(() => {
      expect(screen.getByText('Escolha seu plano Cards Marketplace')).toBeInTheDocument()
    })
    
    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Escolha seu plano Cards Marketplace')).not.toBeInTheDocument()
    })
  })

  test('serviços têm efeito de hover', () => {
    renderServices()
    
    const serviceCards = screen.getAllByText('Cards Marketplace')[0].closest('[class*="cursor-pointer"]')
    expect(serviceCards).toHaveClass('cursor-pointer', 'transform', 'hover:scale-105', 'transition-transform')
  })
})
