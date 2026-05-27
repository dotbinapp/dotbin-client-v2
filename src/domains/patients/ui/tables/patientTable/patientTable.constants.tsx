import { AtSign, CalendarClock, Hash, SquaresSubtract, MoreVertical, Phone, UserRound } from 'lucide-react'
import { Button } from '@shared/ui/atoms'
import type { BaseTableColumn, BaseTableFilterOption } from '@shared/ui/organisms'
import PatientIdentityCell from './PatientIdentityCell.component'
import type { PatientTableFilter, PatientTablePreview, PatientTableSortField } from './patientTable.types'
import { formatPatientVisitDate, getInstagramProfileUrl, getWhatsAppUrl } from './patientTable.utils'

export const MOCK_PATIENTS: PatientTablePreview[] = [
  {
    documentNumber: '33.812.442',
    fullName: 'Martina Alvarez',
    id: 'mock-patient-1',
    instagramAccount: 'marti.alvarez',
    isActive: true,
    lastVisitAt: '2026-05-18',
    phone: '+54 9 11 5488-1290',
    visits: 14,
  },
  {
    documentNumber: '27.441.903',
    fullName: 'Ricardo Funes',
    id: 'mock-patient-2',
    instagramAccount: 'ricardo.funes',
    isActive: false,
    lastVisitAt: '2026-04-29',
    phone: '+54 9 341 602-7731',
    visits: 6,
  },
]

export const PATIENT_TABLE_FILTERS: BaseTableFilterOption<PatientTableFilter>[] = [
  { Icon: UserRound, apiField: 'isActive', label: 'Activos', value: 'active' },
  { Icon: UserRound, apiField: 'isActive', label: 'Inactivos', value: 'inactive' },
  { Icon: AtSign, apiField: 'instagramAccount', label: 'Con Instagram', value: 'withInstagram' },
  { Icon: Phone, apiField: 'phone', label: 'Con teléfono', value: 'withPhone' },
]

export const PATIENT_TABLE_COLUMNS: BaseTableColumn<PatientTablePreview, PatientTableSortField>[] = [
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
    renderCell: (patient) => (
      <a
        className="text-ui-text-muted underline underline-offset-4 transition-colors hover:text-ui-primary-text"
        href={getWhatsAppUrl(patient.phone)}
        rel="noreferrer"
        target="_blank"
      >
        {patient.phone}
      </a>
    ),
  },
  {
    HeaderIcon: CalendarClock,
    id: 'lastVisitAt',
    label: 'Última visita',
    renderCell: (patient) => <span className="font-mono text-ui-text-muted">{formatPatientVisitDate(patient.lastVisitAt)}</span>,
    sortField: 'lastVisitAt',
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
