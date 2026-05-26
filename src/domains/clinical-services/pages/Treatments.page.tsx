import { Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'

function TreatmentsPage() {
  return (
    <BaseContainer as="main" padding="none" surface="transparent" fullHeight>
      <Text as="h1" variant="title">
        Tratamientos
      </Text>
      <Text className="mt-2" tone="muted">
        Página de tratamientos y servicios clínicos.
      </Text>
    </BaseContainer>
  )
}

export default TreatmentsPage
