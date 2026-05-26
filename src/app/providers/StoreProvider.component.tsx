import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@app/store'

interface StoreProviderProps {
  children: ReactNode
}

function StoreProvider({ children }: Readonly<StoreProviderProps>) {
  return <Provider store={store}>{children}</Provider>
}

export default StoreProvider
