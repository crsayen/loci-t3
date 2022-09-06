import { createContext, ReactNode, useContext, useState } from 'react'

type Ctx =
  | {
      loading: boolean
      setLoading: (isLoading: boolean) => void
    }
  | undefined

const LoadingContext = createContext<Ctx>(undefined)

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loading, setLoading] = useState(false)
  const value = { loading, setLoading }

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}
