import { Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'

function PatientServiceHistoryPage() {
  return (
    <BaseContainer as="section" radius="xl" surface="solid">
      <Text as="h2" variant="label" className="text-base">Historial de servicios</Text>
    </BaseContainer>
  )
}

export default PatientServiceHistoryPage
