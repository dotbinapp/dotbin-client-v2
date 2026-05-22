import { BrowserRouter } from 'react-router-dom'
import AppLayout from '@src/app/ui/layout/AppLayout.component'
import Text from '@src/shared/ui/atoms/Text.component'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Text as="h1" variant="title">
          Dotbin Client 2
        </Text>
        <Text className="mt-2" variant="subtitle">
          Layout base inicial para la migración por dominios.
        </Text>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
