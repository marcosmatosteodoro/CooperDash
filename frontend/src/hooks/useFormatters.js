import { useCallback } from 'react';

const useFormatters = () => {
  const formatCPF = useCallback((cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }, []);

  const formatCNPJ = useCallback((cnpj) => {
    if (!cnpj) return '';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }, []);

  const formatDocument = useCallback((documento, tipoPessoa) => {
    if (!documento) return '';
    if (tipoPessoa === 'FISICA') return formatCPF(documento);
    if (tipoPessoa === 'JURIDICA') return formatCNPJ(documento);
    return documento;
  }, [formatCPF, formatCNPJ]);

  const formatDate = useCallback((data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  }, []);

  const formatCurrency = useCallback((valor) => {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }, []);

  return {
    formatCPF,
    formatCNPJ,
    formatDocument,
    formatDate,
    formatCurrency
  };
};

export default useFormatters;