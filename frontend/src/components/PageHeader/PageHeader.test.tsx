import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';
import type { BreadcrumbsInterface, BreadcrumbType } from "@/types/ui";
import '@testing-library/jest-dom';

// Criando mock da função useLayout
const useLayoutMock = jest.fn();

jest.mock('../../providers/LayoutProvider', () => ({
  useLayout: () => useLayoutMock(),
}));

// Mock do componente Breadcrumb
jest.mock('./Breadcrumb', () => ({
  Breadcrumb: ({ breadcrumbs }: BreadcrumbsInterface) => (
    <nav data-testid="breadcrumb-mock">
      {breadcrumbs.map((b: BreadcrumbType, i: number) => (
        <span key={i}>{b.label}</span>
      ))}
    </nav>
  ),
}));

describe('<PageHeader />', () => {
  it('renderiza título, ícone, breadcrumbs e botões', () => {
    useLayoutMock.mockReturnValue({
      layoutData: {
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard' },
        ],
        title: 'Painel de Controle',
        icon: 'bi-speedometer2',
        buttons: <button>Salvar</button>,
      },
    });

    render(<PageHeader />);

    expect(screen.getByTestId('breadcrumb-mock')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Painel de Controle');
    expect(screen.getByRole('heading')).toContainHTML('i');
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('não renderiza título, ícone ou botões se layoutData estiver vazio', () => {
    useLayoutMock.mockReturnValue({
      layoutData: {},
    });

    const { container } = render(<PageHeader />);

    expect(container.querySelector('h1')).not.toBeInTheDocument();
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });
});
