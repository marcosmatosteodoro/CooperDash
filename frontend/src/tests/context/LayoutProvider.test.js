import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayoutProvider, LayoutContext } from '../../context/LayoutContext';
import userEvent from '@testing-library/user-event';

describe('LayoutProvider', () => {
  beforeEach(() => {
    // Garante que o localStorage esteja limpo antes de cada teste
    localStorage.clear();
    document.body.className = '';
    document.documentElement.removeAttribute('data-bs-theme');
  });

  it('fornece valores padrão ao contexto', () => {
    let receivedContext;

    render(
      <LayoutProvider>
        <LayoutContext.Consumer>
          {(context) => {
            receivedContext = context;
            return <div>Context Loaded</div>;
          }}
        </LayoutContext.Consumer>
      </LayoutProvider>
    );

    expect(receivedContext).toBeDefined();
    expect(receivedContext.layoutData).toHaveProperty('theme');
    expect(['dark', 'light']).toContain(receivedContext.layoutData.theme);
  });

  it('alterna o tema corretamente', () => {
    let context;

    render(
      <LayoutProvider>
        <LayoutContext.Consumer>
          {(ctx) => {
            context = ctx;
            return <button onClick={ctx.toggleTheme}>Toggle</button>;
          }}
        </LayoutContext.Consumer>
      </LayoutProvider>
    );

    const button = screen.getByText('Toggle');
    const initialTheme = context.layoutData.theme;

    userEvent.click(button);
    expect(context.layoutData.theme).toBe(initialTheme === 'dark' ? 'light' : 'dark');

    // Testa o efeito colateral no document
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe(context.layoutData.theme);
    expect(localStorage.getItem('theme')).toBe(context.layoutData.theme);
  });

  it('usa o tema salvo no localStorage se existir', () => {
    localStorage.setItem('theme', 'light');

    let theme;
    render(
      <LayoutProvider>
        <LayoutContext.Consumer>
          {(ctx) => {
            theme = ctx.layoutData.theme;
            return <div>Ready</div>;
          }}
        </LayoutContext.Consumer>
      </LayoutProvider>
    );


    expect(theme).toBe('light');
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });
});
