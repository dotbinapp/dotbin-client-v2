import type { PatientTreatmentPlan } from '@domains/patients/model'
import { Button, Text } from '@shared/ui/atoms'
import { AsyncSectionContainer } from '@shared/ui/layout'
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
    <AsyncSectionContainer
      id="planes"
      surface="solid"
      radius="xl"
      className="scroll-mt-6 p-0! flex-1"
      isError={isError}
      isLoading={isLoading}
      errorMessage="No se pudieron cargar los planes activos."
    >
      <div className="flex flex-col gap-3 p-4 pb-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Text as="h2" variant="label" className="text-base">Planes activos</Text>
          <Button size="sm" variant="link" href="plans">
            Ver historial de planes
            <ArrowRight size={12}/>
          </Button>
        </div>
      </div>

      <div className="px-3 py-2">
        {activePlans.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <Text variant="body" tone="muted">No hay planes activos.</Text>
          </div>
        ) : null}

        {activePlans.length > 0 ? (
          <div className="divide-y divide-ui-border overflow-hidden rounded-2xl border border-ui-border bg-ui-surface">
            {activePlans.map((plan) => (
              <PatientTreatmentPlanCard key={plan.id} plan={plan} variant="compact" />
            ))}
          </div>
        ) : null}
      </div>
    </AsyncSectionContainer>
  )
}

export default PatientActivePlans
