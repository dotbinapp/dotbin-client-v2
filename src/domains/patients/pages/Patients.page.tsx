import { PatientTable } from '@domains/patients/ui/tables'
import { BaseContainer } from '@shared/ui/layout'

//TODO: add support to filter patients by instagram, dedudas
function PatientsPage() {
  return (
    <BaseContainer as="main" className="flex min-h-0 flex-col gap-5" padding="none" surface="transparent" fullHeight>
      <PatientTable />
    </BaseContainer>
  )
}

export default PatientsPage
