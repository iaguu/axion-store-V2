import React from 'react'
import { render, screen } from '@testing-library/react'

// Teste simples para verificar configuração
describe('Teste Simples', () => {
  test('renderiza um componente simples', () => {
    const TestComponent = () => <div>Teste</div>
    render(<TestComponent />)
    expect(screen.getByText('Teste')).toBeInTheDocument()
  })

  test('verifica se React está funcionando', () => {
    expect(React.createElement).toBeDefined()
  })
})
