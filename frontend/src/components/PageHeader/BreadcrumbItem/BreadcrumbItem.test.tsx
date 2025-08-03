import React from 'react';
import { render, screen } from '@testing-library/react';
import { BreadcrumbItem } from './BreadcrumbItem';
import '@testing-library/jest-dom';
import { BreadcrumbItemInterface } from '../';

// mock para breadcrumb básico
const mockBreadcrumb = {
  label: 'Dashboard',
  path: '/dashboard',
};

describe('<BreadcrumbItem />', () => {
  it('renderiza breadcrumb como link quando não for o último', () => {
    render(<BreadcrumbItem breadcrumb={mockBreadcrumb} isLast={false} isFirst={false} />);
    
    const link = screen.getByRole('link', { name: /dashboard/i });
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).toHaveTextContent('Dashboard');
  });

  it('renderiza ícone de casa se for o primeiro item', () => {
    render(<BreadcrumbItem breadcrumb={mockBreadcrumb} isLast={false} isFirst={true} />);
    
    const icon = screen.getByRole('link').querySelector('.bi-house-fill');
    expect(icon).toBeInTheDocument();
  });

  it('renderiza breadcrumb como texto simples quando for o último', () => {
    render(<BreadcrumbItem breadcrumb={mockBreadcrumb} isLast={true} isFirst={false} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('atribui aria-current="page" quando for o último', () => {
    render(<BreadcrumbItem breadcrumb={mockBreadcrumb} isLast={true} isFirst={false} />);
    
    const item = screen.getByText('Dashboard').closest('li');
    expect(item).toHaveAttribute('aria-current', 'page');
  });
});
