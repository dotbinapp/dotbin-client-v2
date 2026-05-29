import type { PatientTreatmentPlan } from '@domains/patients/model'
import { Button, Skeleton, Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'
import { PatientTreatmentPlanCard } from '../components'
import { ArrowRight } from 'lucide-react'

interface PatientActivePlansProps {
  isError?: boolean
  isLoading?: boolean
  plans?: PatientTreatmentPlan[]
}

function isActivePlan(plan: PatientTreatmentPlan) {
  return plan.status === 'ACTIVE' && plan.completedSessions < plan.totalSessions
}

function PatientActivePlans({ isError = false, isLoading = false, plans = [] }: Readonly<PatientActivePlansProps>) {
  const activePlans = plans.filter(isActivePlan)

  return (
    <BaseContainer as="section" id="planes" surface="solid" radius="xl" className="scroll-mt-6 p-0! flex-1">
      <div className="flex flex-col gap-3 p-4 pb-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Text as="h2" variant="label" className="text-base">Planes activos</Text>
          <Button size="sm" variant="link" disabled>
            Ver historial de planes
            <ArrowRight size={12}/>
          </Button>
        </div>
      </div>

      <div className="px-3 py-2">
        {isLoading ? (
          <div className="space-y-2 py-2" aria-label="Cargando planes activos">
            <Skeleton size="lg" />
            <Skeleton size="lg" />
          </div>
        ) : null}

        {!isLoading && isError ? (
          <div className="px-2 py-6 text-center">
            <Text variant="body" tone="muted">No se pudieron cargar los planes activos.</Text>
          </div>
        ) : null}

        {!isLoading && !isError && activePlans.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <Text variant="body" tone="muted">No hay planes activos.</Text>
          </div>
        ) : null}

        {!isLoading && !isError && activePlans.length > 0 ? (
          <div className="divide-y divide-ui-border overflow-hidden rounded-2xl border border-ui-border bg-ui-surface">
            {activePlans.map((plan) => (
              <PatientTreatmentPlanCard key={plan.id} plan={plan} variant="compact" />
            ))}
          </div>
        ) : null}
      </div>
    </BaseContainer>
  )
}

export default PatientActivePlans
