import { BrowserRouter } from 'react-router-dom'
import { Auth0ProviderWithNavigate } from '@src/app/providers'
import AppLayout from '@src/app/components/layout/AppLayout.component'
import Text from '@src/shared/ui/atoms/Text.component'

function App() {
  return (
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <AppLayout>
          <Text as="h1" variant="title">
            Dotbin Client 2
          </Text>
          <Text className="mt-2" variant="subtitle">
            Layout base inicial para la migración por dominios.
          </Text>
        </AppLayout>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  )
}

export default App
