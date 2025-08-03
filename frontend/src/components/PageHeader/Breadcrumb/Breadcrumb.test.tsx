import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';
import '@testing-library/jest-dom';
import { BreadcrumbType, BreadcrumbItemInterface } from '../';

// Mock do componente BreadcrumbItem
jest.mock('../BreadcrumbItem', () => ({
  BreadcrumbItem: ({ breadcrumb, isFirst, isLast }: BreadcrumbItemInterface) => (
    <li data-testid="breadcrumb-item" data-first={isFirst} data-last={isLast}>
      {breadcrumb.label}
    </li>
  ),
}));

const breadcrumbsMock: BreadcrumbType[] = [
  { label: 'Início', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Relatórios', path: '/dashboard/reports' },
];

describe('<Breadcrumb />', () => {
  it('renderiza todos os itens corretamente', () => {
    render(<Breadcrumb breadcrumbs={breadcrumbsMock} />);

    const items = screen.getAllByTestId('breadcrumb-item');
    expect(items).toHaveLength(3);

    expect(items[0]).toHaveAttribute('data-first', 'true');
    expect(items[0]).toHaveAttribute('data-last', 'false');

    expect(items[1]).toHaveAttribute('data-first', 'false');
    expect(items[1]).toHaveAttribute('data-last', 'false');

    expect(items[2]).toHaveAttribute('data-first', 'false');
    expect(items[2]).toHaveAttribute('data-last', 'true');
  });

  it('renderiza a navegação com o atributo correto', () => {
    render(<Breadcrumb breadcrumbs={breadcrumbsMock} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'breadcrumb');
  });
});
