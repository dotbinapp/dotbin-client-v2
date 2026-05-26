import { Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'

function DashboardPage() {
  return (
    <BaseContainer as="main" surface="transparent" padding="none" fullHeight>
      <Text as="h1" variant="title">
        Dashboard
      </Text>
      <Text className="mt-2" tone="muted">
        Página inicial del dominio de analytics.
      </Text>
    </BaseContainer>
  )
}

export default DashboardPage
