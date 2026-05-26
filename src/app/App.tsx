import { BrowserRouter } from 'react-router-dom'
import { AppSessionBootstrap } from '@app/bootstrap'
import { AppLayout } from '@app/components/layout'
import { Auth0ProviderWithNavigate, StoreProvider, ThemeModeProvider } from '@app/providers'
import { AppRouter } from '@app/router'
import { Toast } from '@shared/ui/feedback'

function App() {
  return (
    <StoreProvider>
      <ThemeModeProvider>
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
      </ThemeModeProvider>
    </StoreProvider>
  )
}

export default App
