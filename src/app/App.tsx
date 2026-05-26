import { BrowserRouter } from 'react-router-dom'
import { AppSessionBootstrap } from '@app/bootstrap'
import { AppLayout } from '@app/components/layout'
import { Auth0ProviderWithNavigate, StoreProvider } from '@app/providers'
import { AppRouter } from '@app/router'
import { Toast } from '@shared/ui/feedback'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <AppSessionBootstrap>
            <AppLayout>
              <AppRouter />
            </AppLayout>
            <Toast />
          </AppSessionBootstrap>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
