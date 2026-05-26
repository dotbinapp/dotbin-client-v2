import Text from '@src/shared/ui/atoms/Text.component'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'

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
