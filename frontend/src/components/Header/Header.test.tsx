import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { useLayout } from '../../providers/LayoutProvider';

// Mock do Next.js
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: React.PropsWithChildren<{ href: string }>) => <a href={href}>{children}</a>;
  MockLink.displayName = 'Link';
  return MockLink;
});

jest.mock('next/image', () => {
  const MockImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt={props.alt} data-testid="project-logo" />;
  MockImage.displayName = 'Image';
  return MockImage;
});

// Mock do ProfileDropdown
jest.mock('../', () => ({
  ProfileDropdown: () => <div data-testid="profile-dropdown">ProfileDropdown</div>,
}));

// Mock do LayoutProvider
jest.mock('../../providers/LayoutProvider', () => ({
  useLayout: jest.fn(),
}));

describe('<Header />', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar placeholder quando mounted for false', () => {
    // Simula montagem incompleta
    (useLayout as jest.Mock).mockReturnValue({
      layoutData: { theme: 'light' },
      toggleTheme: mockToggleTheme,
    });

    const { container } = render(<Header />);
    // O header placeholder será renderizado antes de useEffect
    expect(container.querySelector('.navbar')).toBeInTheDocument();
  });

  it('deve renderizar logo branca quando tema for dark', async () => {
    (useLayout as jest.Mock).mockReturnValue({
      layoutData: { theme: 'dark' },
      toggleTheme: mockToggleTheme,
    });

    render(<Header />);
    expect(await screen.findByAltText('Logo do Projeto')).toBeInTheDocument();
  });

  it('deve chamar toggleTheme ao clicar no botão de tema', async () => {
    (useLayout as jest.Mock).mockReturnValue({
      layoutData: { theme: 'light' },
      toggleTheme: mockToggleTheme,
    });

    render(<Header />);
    const themeBtn = await screen.findByRole('button', {
      name: /ativar modo escuro/i,
    });
    fireEvent.click(themeBtn);
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it('deve renderizar o ProfileDropdown', async () => {
    (useLayout as jest.Mock).mockReturnValue({
      layoutData: { theme: 'light' },
      toggleTheme: mockToggleTheme,
    });

    render(<Header />);
    expect(await screen.findByTestId('profile-dropdown')).toBeInTheDocument();
  });

  it('deve adicionar classe "scrolled" ao header quando scrollY > 50', () => {
    (useLayout as jest.Mock).mockReturnValue({
      layoutData: { theme: 'light' },
      toggleTheme: mockToggleTheme,
    });

    render(<Header />);

    // Simula scroll
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    const header = screen.getByRole('banner'); // <header> tag has "banner" role
    expect(header.classList.contains('scrolled')).toBe(true);
  });
});
