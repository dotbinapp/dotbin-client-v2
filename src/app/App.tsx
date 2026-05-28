import { BrowserRouter } from 'react-router-dom'
import { AppSessionBootstrap } from '@app/bootstrap'
import { AppLayout } from '@app/components/layout'
import { Auth0ProviderWithNavigate, QueryProvider, StoreProvider, ThemeModeProvider, useThemeMode } from '@app/providers'
import { AppRouter } from '@app/router'
import { Toast } from '@shared/ui/atoms'

function App() {
  return (
    <StoreProvider>
      <ThemeModeProvider>
        <BrowserRouter>
          <Auth0ProviderWithNavigate>
            <QueryProvider>
              <AppSessionBootstrap>
                <AppLayout>
                  <AppRouter />
                </AppLayout>
                <AppToast />
              </AppSessionBootstrap>
            </QueryProvider>
          </Auth0ProviderWithNavigate>
        </BrowserRouter>
      </ThemeModeProvider>
    </StoreProvider>
  )
}

function AppToast() {
  const { themeMode } = useThemeMode()

  return <Toast theme={themeMode} />
}

export default App
