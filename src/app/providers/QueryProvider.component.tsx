import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * 60 * 1000,
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

function QueryProvider({ children }: Readonly<QueryProviderProps>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider
