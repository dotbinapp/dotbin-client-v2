import Text from '@src/shared/ui/atoms/Text.component'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'

function PatientsPage() {
  return (
    <BaseContainer as="main" padding="lg" fullHeight>
      <Text as="h1" variant="title">
        Pacientes
      </Text>
      <Text className="mt-2" tone="muted">
        Página de listado y gestión inicial de pacientes.
      </Text>
    </BaseContainer>
  )
}

export default PatientsPage
