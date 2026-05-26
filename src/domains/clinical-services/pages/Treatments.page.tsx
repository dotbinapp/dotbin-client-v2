import Text from '@src/shared/ui/atoms/Text.component'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'

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
