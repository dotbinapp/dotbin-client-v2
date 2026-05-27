import { AtSign, CalendarClock, Hash, SquaresSubtract, MoreVertical, Phone, UserRound } from 'lucide-react'
import type { PatientSummary } from '@domains/patients/model/patient.types'
import { Button } from '@shared/ui/atoms'
import type { BaseTableColumn, BaseTableFilterOption } from '@shared/ui/organisms'
import PatientIdentityCell from './PatientIdentityCell.component'
import type { PatientTableFilter, PatientTableSortField } from './patientTable.types'
import { formatPatientVisitDate, getInstagramProfileUrl, getWhatsAppUrl } from './patientTable.utils'

export const PATIENT_TABLE_FILTERS: BaseTableFilterOption<PatientTableFilter>[] = [
  { Icon: UserRound, apiField: 'isActive', label: 'Activos', value: 'active' },
  { Icon: UserRound, apiField: 'isActive', label: 'Inactivos', value: 'inactive' },
  { Icon: AtSign, apiField: 'instagramAccount', label: 'Con Instagram', value: 'withInstagram' },
  { Icon: Phone, apiField: 'phone', label: 'Con teléfono', value: 'withPhone' },
]

export const PATIENT_TABLE_COLUMNS: BaseTableColumn<PatientSummary, PatientTableSortField>[] = [
  {
    HeaderIcon: UserRound,
    id: 'patient',
    label: 'Nombre',
    renderCell: (patient) => <PatientIdentityCell patient={patient} />,
    sortField: 'fullName',
    widthClassName: 'min-w-72',
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
    renderCell: (patient) => <span className="font-mono text-ui-text-muted">{formatPatientVisitDate(patient.lastVisitAt)}</span>,
  },
  {
    HeaderIcon: Hash,
    id: 'visits',
    label: 'Total visitas',
    renderCell: (patient) => (
      <span className="inline-flex min-w-10 justify-center rounded-full bg-ui-surface-muted px-3 py-1 text-xs font-black text-ui-text-muted">
        {patient.visits}
      </span>
    ),
  },
  {
    align: 'center',
    HeaderIcon: SquaresSubtract,
    id: 'actions',
    label: 'Acciones',
    renderCell: () => (
      <div className="flex justify-center gap-2">
        <Button aria-label="Más acciones" Icon={MoreVertical} iconOnly size="sm" variant="ghost" />
      </div>
    ),
  },
]
