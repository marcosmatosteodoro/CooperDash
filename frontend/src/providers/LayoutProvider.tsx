'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'

type LayoutData = {
  breadcrumbs: Array<{ label: string; path?: string }>
  title: string
  icon: string
  buttons: React.ReactNode | null
  theme: 'dark' | 'light'
}

type LayoutContextType = {
  layoutData: LayoutData
  setLayoutData: React.Dispatch<React.SetStateAction<LayoutData>>
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

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', layoutData.theme)
    localStorage.setItem('theme', layoutData.theme)
    
    if (layoutData.theme === 'dark') {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [layoutData.theme])

  const toggleTheme = () => {
    setLayoutData(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }))
  }

  return (
    <LayoutContext.Provider value={{ layoutData, setLayoutData, toggleTheme }}>
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