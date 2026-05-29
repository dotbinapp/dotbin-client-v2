import { Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'

function PatientEvolutionPage() {
  return (
    <BaseContainer as="section" radius="xl" surface="solid">
      <Text as="h2" variant="label" className="text-base">Evolución</Text>
    </BaseContainer>
  )
}

export default PatientEvolutionPage
