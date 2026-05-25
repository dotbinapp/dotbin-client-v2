import { BrowserRouter } from 'react-router-dom'
import { AppSessionBootstrap } from '@src/app/bootstrap'
import { Auth0ProviderWithNavigate, StoreProvider } from '@src/app/providers'
import { AppRouter } from '@src/app/router'
import { AppLayout } from '@src/app/components/layout'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <AppSessionBootstrap>
            <AppLayout>
              <AppRouter />
            </AppLayout>
          </AppSessionBootstrap>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
