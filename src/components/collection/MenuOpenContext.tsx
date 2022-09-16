import { createContext, ReactNode, useContext, useState } from 'react'

type Ctx =
  | {
      hasCheckoutMenuOpen: string | undefined
      sethasCheckoutMenuOpen: (hasCheckoutMenuOpen?: string) => void
    }
  | undefined

const MenuOpenContext = createContext<Ctx>(undefined)

interface MenuOpenProviderProps {
  children: ReactNode
}

export function MenuOpenProvider({ children }: MenuOpenProviderProps) {
  const [hasCheckoutMenuOpen, sethasCheckoutMenuOpen] = useState<string>()
  const value = { hasCheckoutMenuOpen, sethasCheckoutMenuOpen }

  return <MenuOpenContext.Provider value={value}>{children}</MenuOpenContext.Provider>
}

export function useMenuOpen() {
  const context = useContext(MenuOpenContext)
  if (!context) {
    throw new Error('useMenuOpen must be used within MenuOpenProvider')
  }
  return context
}
