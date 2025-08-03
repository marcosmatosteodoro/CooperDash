import { render, screen } from '@testing-library/react'
import { ErrorAlert } from './ErrorAlert'

describe('ErrorAlert', () => {
  it('renderiza a mensagem de erro corretamente', () => {
    const message = 'Algo deu errado!'
    render(<ErrorAlert message={message} />)

    // Verifica se o texto "Erro:" aparece
    expect(screen.getByText(/Erro:/)).toBeInTheDocument()

    // Verifica se a mensagem específica aparece
    expect(screen.getByText(message)).toBeInTheDocument()

    // Verifica se o botão de fechar está presente
    const closeButton = screen.getByRole('button', { name: /close/i })
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveClass('btn-close')
  })
})
