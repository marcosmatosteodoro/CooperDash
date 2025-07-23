import { renderHook } from '@testing-library/react';
import useFormatters from '../../hooks/useFormatters';

describe('useFormatters', () => {
  it('formata CPF corretamente', () => {
    const { result } = renderHook(() => useFormatters());
    const formatted = result.current.formatCPF('12345678901');
    expect(formatted).toBe('123.456.789-01');
  });

  it('formata CNPJ corretamente', () => {
    const { result } = renderHook(() => useFormatters());
    const formatted = result.current.formatCNPJ('12345678000199');
    expect(formatted).toBe('12.345.678/0001-99');
  });

  it('formata documento como CPF quando tipo é FISICA', () => {
    const { result } = renderHook(() => useFormatters());
    const formatted = result.current.formatDocument('12345678901', 'FISICA');
    expect(formatted).toBe('123.456.789-01');
  });

  it('formata documento como CNPJ quando tipo é JURIDICA', () => {
    const { result } = renderHook(() => useFormatters());
    const formatted = result.current.formatDocument('12345678000199', 'JURIDICA');
    expect(formatted).toBe('12.345.678/0001-99');
  });

  it('retorna documento original se tipoPessoa for inválido', () => {
    const { result } = renderHook(() => useFormatters());
    const formatted = result.current.formatDocument('12345678901', 'OUTRO');
    expect(formatted).toBe('12345678901');
  });

  it('formata data corretamente', () => {
    const { result } = renderHook(() => useFormatters());
    const formatted = result.current.formatDate('2023-07-23');
    expect(formatted).toBe('23/07/2023');
  });

  it('formata moeda corretamente', () => {
    const { result } = renderHook(() => useFormatters());
    const formatted = result.current.formatCurrency(1234.56);
    expect(formatted).toBe('R$ 1.234,56'); // Pode variar com o locale do ambiente
  });

  it('retorna R$ 0,00 se valor for nulo ou indefinido', () => {
    const { result } = renderHook(() => useFormatters());
    expect(result.current.formatCurrency(null)).toBe('R$ 0,00');
    expect(result.current.formatCurrency(undefined)).toBe('R$ 0,00');
  });
});
