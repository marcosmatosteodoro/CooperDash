import React, { createContext, useState, useEffect } from 'react';

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  // Verifica se há preferência salva no localStorage ou prefere o tema do sistema
  const getInitialTheme = () => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && ['dark', 'light'].includes(savedTheme)) return savedTheme;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      }
    } catch (err) {
      console.error('Erro ao obter tema inicial', err);
    }

    return 'dark';
  };

  const [layoutData, setLayoutData] = useState({
    breadcrumbs: [],
    title: '',
    icon: '',
    buttons: null,
    theme: getInitialTheme()
  });

  // Atualiza o tema no documento e localStorage quando muda
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', layoutData.theme);
    localStorage.setItem('theme', layoutData.theme);
    
    // Adiciona/remove a classe dark do body para compatibilidade
    if (layoutData.theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [layoutData.theme]);

  // Função para alternar entre dark/light mode
  const toggleTheme = () => {
    setLayoutData(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  // Valor do contexto agora inclui a função toggleTheme
  const value = {
    layoutData,
    setLayoutData,
    toggleTheme
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};