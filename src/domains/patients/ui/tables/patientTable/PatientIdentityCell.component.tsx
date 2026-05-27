import { UserRound } from 'lucide-react'
import { Text } from '@shared/ui/atoms'
import type { PatientTablePreview } from './patientTable.types'

interface PatientIdentityCellProps {
  patient: PatientTablePreview
}

function PatientIdentityCell({ patient }: Readonly<PatientIdentityCellProps>) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-ui-primary-soft text-ui-primary-text shadow-sm">
        <UserRound aria-hidden="true" size={20} />
      </div>

      <div className="min-w-0">
        <Text className="truncate font-black" variant="body">
          {patient.fullName}
        </Text>
        <Text className="text-xs" tone="muted">
          Paciente mockeado
        </Text>
      </div>
    </div>
  )
}

export default PatientIdentityCell
