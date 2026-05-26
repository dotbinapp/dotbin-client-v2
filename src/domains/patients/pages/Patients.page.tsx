import { Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'

function PatientsPage() {
  return (
    <BaseContainer as="main" padding="none" surface="transparent" fullHeight>
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
