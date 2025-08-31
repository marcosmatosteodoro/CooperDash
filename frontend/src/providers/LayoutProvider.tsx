// LayoutProvider.tsx
'use client'

import Link from 'next/link';
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'

type LayoutData = {
  breadcrumbs: Array<{ label: string; path?: string }>
  title: string
  icon: string
  buttons: React.ReactNode | null
  theme: 'dark' | 'light'
}

type SetListLayout = ({ path, label, buttonName }: { path: string, label: string, buttonName: string }) => void
type SetNewLayout = ({ path, label, title }: { path: string, label: string, title: string }) => void
type SetEditLayout = ({ path, label, id, dynamicLabel }: { path: string, label: string, id: string, dynamicLabel: string }) => void
type SetShowLayout = ({ path, label, id, dynamicLabel, onClick }: { path: string, label: string, id: string, dynamicLabel: string, onClick: () => void }) => void

type LayoutContextType = {
  layoutData: LayoutData
  setNewLayout: SetNewLayout
  setEditLayout: SetEditLayout
  setShowLayout: SetShowLayout
  setListLayout: SetListLayout
  toggleTheme: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const getInitialTheme = (): 'dark' | 'light' => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
      }
    } catch (err) {
      console.error('Erro ao obter tema inicial', err)
    }
    return 'dark'
  }

  const [layoutData, setLayoutData] = useState<LayoutData>({
    breadcrumbs: [],
    title: '',
    icon: '',
    buttons: null,
    theme: getInitialTheme()
  })

  // Use useCallback para memoizar as funções
  const setListLayout = useCallback(({ path, label, buttonName }: { path: string, label: string, buttonName: string }) => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: path, label: label }
      ],
      title: `Lista de ${label}`,
      icon: '',
      buttons: (
        <Link className="btn btn-primary" href={`${path}/novo`}>
          <i className="bi bi-plus-circle me-2"></i>{buttonName}
        </Link>
      )
    }));
  }, []);

  const setNewLayout = useCallback(({path, label, title}: { path: string, label: string, title: string }) => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: path, label: label },
        { label: 'Novo' },
      ],
      title: title,
      icon: 'bi-person-plus',
      buttons: (
        <Link className="btn btn-outline-secondary" href={path}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Link>
      )
    }));
  }, []);

  const setEditLayout = useCallback(({path, label, id, dynamicLabel}: { path: string, label: string, id: string, dynamicLabel: string }) => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: path, label: label }, 
        { path: `${path}/${id}`, label: dynamicLabel},
        { label: 'Edição' }
      ],
      title: `Editar ${label}`,
      icon: 'bi-pencil-square',
      buttons: (
        <Link className="btn btn-outline-secondary" href={`${path}/${id}`}>
          <i className="bi bi-arrow-left me-2"></i>Voltar
        </Link>
      )
    }));
  }, []);

  const setShowLayout = useCallback(({path, label, id, dynamicLabel, onClick}: { path: string, label: string, id: string, dynamicLabel: string, onClick: () => void }) => {
    setLayoutData(prev => ({
      ...prev,
      breadcrumbs: [
        { path: '/', label: 'Home' }, 
        { path: path, label: label }, 
        { label: dynamicLabel }
      ],
      title: dynamicLabel,
      icon: 'bi-person-badge',
      buttons: (
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href={`${path}/${id}/editar`}>
            <i className="bi bi-pencil-square me-2"></i>Editar
          </Link>
          <button 
            onClick={onClick}
            className="btn btn-danger"
          >
            <i className="bi bi-trash me-2"></i>Excluir
          </button>
          <Link className="btn btn-outline-secondary" href={path}>
            <i className="bi bi-arrow-left me-2"></i>Voltar
          </Link>
        </div>
      )
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setLayoutData(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }))
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', layoutData.theme)
    localStorage.setItem('theme', layoutData.theme)
    
    if (layoutData.theme === 'dark') {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [layoutData.theme])

  const value = {
    layoutData,
    setListLayout,
    setNewLayout,
    setEditLayout,
    setShowLayout,
    toggleTheme
  }

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}

// Hook personalizado para usar o contexto
export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (context === undefined) { 
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}