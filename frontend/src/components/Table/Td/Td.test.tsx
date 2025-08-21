import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Td } from './';
import type { ColumnType, Ressource } from "@/types/ui";
describe('Td component', () => {
  const baseRessource: Ressource = { name: 'John Doe', url: '/profile/john' };

  it('renders text when type is text or undefined', () => {
    const column: ColumnType = {
      attribute: 'name',
      type: 'text',
      className: 'custom-class',
      style: { maxWidth: '150px' }
    };

    render(<table><tbody><tr><Td column={column} ressource={baseRessource} /></tr></tbody></table>);

    const td = screen.getByText('John Doe');
    console.log('td', td.style.color)
    expect(td).toBeInTheDocument();
    expect(td).toHaveClass('custom-class');
    expect(td).toHaveStyle({ maxWidth: '150px'});
  });

  it('renders text when type is undefined (default to text)', () => {
    const column = {
      attribute: 'name'
    };

    render(<table><tbody><tr><Td column={column} ressource={baseRessource} /></tr></tbody></table>);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders a link when type is link and href is provided', () => {
    const column: ColumnType = {
      attribute: 'name',
      type: 'link',
      href: (ressource: Record<string, string>) => ressource.url
    };

    render(<table><tbody><tr><Td column={column} ressource={baseRessource} /></tr></tbody></table>);

    const link = screen.getByRole('link', { name: 'John Doe' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/profile/john');
  });

  it('applies formatter function if provided', () => {
    const column = {
      attribute: 'name',
      formatter: (val: string | number | Record<string, string>) => {
        if (typeof val === 'object' && val !== null) {
          return `User: ${val.name}`;
        }
        return String(val);
      }
    };

    render(<table><tbody><tr><Td column={column} ressource={baseRessource} /></tr></tbody></table>);
    expect(screen.getByText('User: John Doe')).toBeInTheDocument();
  });
});
