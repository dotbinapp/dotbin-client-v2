import { UserRound } from 'lucide-react'
import type { PatientSummary } from '@domains/patients/model/patient.types'

interface PatientIdentityCellProps {
  patient: PatientSummary
}

function PatientIdentityCell({ patient }: Readonly<PatientIdentityCellProps>) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-8 items-center justify-center rounded-xl bg-ui-primary-soft text-ui-primary-text shadow-sm">
        <UserRound aria-hidden="true" size={16} />
      </div>

      <span className="truncate text-sm font-medium text-ui-text">
        {patient.fullName}
      </span>
    </div>
  )
}

export default PatientIdentityCell
