import { AtSign, CalendarClock, Hash, IdCard, SquaresSubtract, MoreVertical, Pencil, Phone, UserRound } from 'lucide-react'
import type { PatientSummary } from '@domains/patients/model/patient.types'
import { MenuButton } from '@shared/ui/molecules'
import type { BaseTableColumn, BaseTableFilterOption } from '@shared/ui/organisms'
import type { PatientTableFilter, PatientTableSortField } from './patientTable.types'
import { formatPatientVisitDate, getInstagramProfileUrl, getWhatsAppUrl } from './patientTable.utils'

export const PATIENT_TABLE_FILTERS: BaseTableFilterOption<PatientTableFilter>[] = [
  { Icon: UserRound, apiField: 'isActive', label: 'Activos', value: 'active' },
  { Icon: UserRound, apiField: 'isActive', label: 'Inactivos', value: 'inactive' },
  { Icon: AtSign, apiField: 'instagramAccount', label: 'Con Instagram', value: 'withInstagram' },
  { Icon: Phone, apiField: 'phone', label: 'Con teléfono', value: 'withPhone' },
]

interface PatientTableColumnsParams {
  canEditPatient: boolean
  onEditPatient: (patient: PatientSummary) => void
}

export function getPatientTableColumns({ canEditPatient, onEditPatient }: PatientTableColumnsParams): BaseTableColumn<PatientSummary, PatientTableSortField>[] {
  const columns: BaseTableColumn<PatientSummary, PatientTableSortField>[] = [
    {
      HeaderIcon: UserRound,
      id: 'patient',
      label: 'Nombre',
      renderCell: (patient) => <span className="font-bold text-ui-text-default">{patient.fullName}</span>,
      sortField: 'fullName',
      widthClassName: 'min-w-72',
    },
    {
      HeaderIcon: IdCard,
      id: 'documentNumber',
      label: 'Nro. documento',
      renderCell: (patient) => <span className="font-mono text-ui-text-muted">{patient.documentNumber ?? '—'}</span>,
    },
    {
      HeaderIcon: AtSign,
      id: 'instagram',
      label: 'Instagram',
      renderCell: (patient) =>
        patient.instagramAccount ? (
          <a
            className="text-ui-text-muted underline underline-offset-4 transition-colors hover:text-ui-primary-text"
            href={getInstagramProfileUrl(patient.instagramAccount)}
            rel="noreferrer"
            target="_blank"
          >
            @{patient.instagramAccount}
          </a>
        ) : (
          <span className="text-ui-text-subtle">—</span>
        ),
    },
    {
      HeaderIcon: Phone,
      id: 'phone',
      label: 'Teléfono',
      renderCell: (patient) =>
        patient.phone ? (
          <a
            className="text-ui-text-muted underline underline-offset-4 transition-colors hover:text-ui-primary-text"
            href={getWhatsAppUrl(patient.phone)}
            rel="noreferrer"
            target="_blank"
          >
            {patient.phone}
          </a>
        ) : (
          <span className="text-ui-text-subtle">—</span>
        ),
    },
    {
      HeaderIcon: CalendarClock,
      id: 'lastVisitAt',
      label: 'Última visita',
      renderCell: (patient) => <span className="text-ui-text-muted">{formatPatientVisitDate(patient.lastVisitAt)}</span>,
    },
    {
      HeaderIcon: Hash,
      align: 'center',
      id: 'visits',
      label: 'Total visitas',
      renderCell: (patient) => (
        <span className="inline-flex min-w-10 justify-center rounded-full bg-ui-surface-muted px-3 py-1 text-xs font-black text-ui-text-muted">
          {patient.visits}
        </span>
      ),
    },

  ]

  if (!canEditPatient) return columns

  return [
    ...columns,
    {
      align: 'center',
      HeaderIcon: SquaresSubtract,
      id: 'actions',
      label: 'Acciones',
      renderCell: (patient) => (
        <div className="flex justify-center gap-2">
          <MenuButton
            aria-label={`Acciones de ${patient.fullName}`}
            Icon={MoreVertical}
            iconOnly
            options={[{ Icon: Pencil, label: 'Editar paciente', onSelect: () => onEditPatient(patient) }]}
            panelOffset="tight"
            panelPlacement="bottom-end"
            size="sm"
            triggerSize="sm"
            variant="ghost"
          />
        </div>
      ),
    },
  ]
}
