import { ProfessionalTable } from '@domains/professionals/ui/tables'
import { BaseContainer } from '@shared/ui/layout'

function ProfessionalsPage() {
  return (
    <BaseContainer as="main" className="flex min-h-0 flex-col gap-5" padding="none" surface="transparent" fullHeight>
      <ProfessionalTable />
    </BaseContainer>
  )
}

export default ProfessionalsPage
