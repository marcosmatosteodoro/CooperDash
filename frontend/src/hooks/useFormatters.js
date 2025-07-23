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
    const date = new Date(data);
    // Extrai dia, mês, ano usando UTC para evitar deslocamento por fuso horário
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
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