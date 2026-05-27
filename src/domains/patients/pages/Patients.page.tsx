import { PatientTable } from '@domains/patients/ui/tables'
import { Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'

function PatientsPage() {
  return (
    <BaseContainer as="main" className="flex min-h-0 flex-col gap-5" padding="none" surface="transparent" fullHeight>
      <header>
        <Text as="h1" variant="title">
          Pacientes
        </Text>
      </header>
      <PatientTable />
    </BaseContainer>
  )
}

export default PatientsPage
