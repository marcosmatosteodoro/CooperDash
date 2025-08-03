import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Thead } from './'

describe('Thead Component', () => {
  it('renders default "#" column and given headers', () => {
    const headers = ['Nome', 'Email', 'Telefone']
    render(<table><Thead headers={headers} actions={false} /></table>)

    expect(screen.getByText('#')).toBeInTheDocument()

    headers.forEach(header => {
      const element = screen.getByText(header)
      expect(element).toBeInTheDocument()
      expect(element).toHaveClass('text-center') // conferindo a className do Th
    })

    expect(screen.queryByText('Ações')).not.toBeInTheDocument()
  })

  it('renders "Ações" column when actions prop is true', () => {
    const headers = ['Nome']
    render(<table><Thead headers={headers} actions /></table>)

    const actionsTh = screen.getByText('Ações')
    expect(actionsTh).toBeInTheDocument()
    expect(actionsTh.tagName).toBe('TH')
    expect(actionsTh).toHaveClass('text-center')
  })
})
