import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renderiza o spinner e os textos corretamente', () => {
    render(<LoadingSpinner />)

    // Verifica se o elemento com papel "status" está presente
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('spinner-border')

    // Verifica o texto visualmente escondido (para acessibilidade)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()

    // Verifica o texto visível
    expect(screen.getByText('Carregando dados...')).toBeInTheDocument()
  })
})
