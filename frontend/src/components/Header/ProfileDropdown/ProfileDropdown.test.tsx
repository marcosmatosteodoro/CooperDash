import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileDropdown } from './ProfileDropdown';

const mockItems = [
  { type: 'header', text: 'Perfil' },
  { type: 'item', text: 'Configurações', icon: 'bi-gear' },
  { type: 'divider' },
  { type: 'item', text: 'Ajuda', icon: 'bi-question-circle' },
];

describe('<ProfileDropdown />', () => {
  it('renderiza botão de dropdown', () => {
    render(<ProfileDropdown items={mockItems} />);
    const button = screen.getByRole('button', { name: /abrir menu do perfil/i });
    expect(button).toBeInTheDocument();
  });

  it('toggle do dropdown ao clicar no botão', () => {
    render(<ProfileDropdown items={mockItems} />);
    const button = screen.getByRole('button', { name: /abrir menu do perfil/i });
    const dropdownMenu = screen.getByRole('list'); // ul element
    
    // Inicialmente não está aberto
    expect(dropdownMenu).not.toHaveClass('show');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);

    // Depois do clique, abre
    expect(dropdownMenu).toHaveClass('show');
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);

    // Fecha novamente
    expect(dropdownMenu).not.toHaveClass('show');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renderiza itens do dropdown corretamente', () => {
    render(<ProfileDropdown items={mockItems} />);
    const button = screen.getByRole('button', { name: /abrir menu do perfil/i });
    fireEvent.click(button);

    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
    expect(screen.getByText('Ajuda')).toBeInTheDocument();

    // verifica se o divider é um <hr> com classe correta
    const divider = screen.getByRole('separator'); // hr tem role separator
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('dropdown-divider');
  });

  it('renderiza botão "Sair" e reage ao clique', () => {
    console.log = jest.fn();
    render(<ProfileDropdown items={mockItems} />);
    const button = screen.getByRole('button', { name: /abrir menu do perfil/i });
    fireEvent.click(button);

    const sairBtn = screen.getByRole('button', { name: /sair/i });
    expect(sairBtn).toBeInTheDocument();

    fireEvent.click(sairBtn);
    expect(console.log).toHaveBeenCalledWith('Sign out');
  });
});
