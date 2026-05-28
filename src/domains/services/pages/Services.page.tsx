import { ServiceTable } from '@domains/services/ui/tables'
import { BaseContainer } from '@shared/ui/layout'

function ServicesPage() {
  return (
    <BaseContainer as="main" className="flex min-h-0 flex-col gap-5" padding="none" surface="transparent" fullHeight>
      <ServiceTable />
    </BaseContainer>
  )
}

export default ServicesPage
