import { Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'

function ServicesPage() {
  return (
    <BaseContainer as="main" padding="none" surface="transparent" fullHeight>
      <Text as="h1" variant="title">
        Servicios
      </Text>
      <Text className="mt-2" tone="muted">
        Página de servicios disponibles para el centro.
      </Text>
    </BaseContainer>
  )
}

export default ServicesPage
