import { FileDown, MoreHorizontal } from 'lucide-react'
import { Button, StatusBadge } from '@shared/ui/atoms'
import type { BaseTableColumn } from '@shared/ui/organisms'
import PatientIdentityCell from './PatientIdentityCell.component'
import type { PatientStatusFilter, PatientTablePreview, PatientTableSortField } from './patientTable.types'
import { formatPatientVisitDate } from './patientTable.utils'

export const MOCK_PATIENTS: PatientTablePreview[] = [
  {
    documentNumber: '33.812.442',
    fullName: 'Martina Alvarez',
    id: 'mock-patient-1',
    isActive: true,
    lastVisitAt: '2026-05-18',
    phone: '+54 9 11 5488-1290',
    visits: 14,
  },
  {
    documentNumber: '27.441.903',
    fullName: 'Ricardo Funes',
    id: 'mock-patient-2',
    isActive: false,
    lastVisitAt: '2026-04-29',
    phone: '+54 9 341 602-7731',
    visits: 6,
  },
]

export const PATIENT_STATUS_FILTERS: Array<{ label: string; value: PatientStatusFilter }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Activos', value: 'active' },
  { label: 'Inactivos', value: 'inactive' },
]

export const PATIENT_TABLE_COLUMNS: BaseTableColumn<PatientTablePreview, PatientTableSortField>[] = [
  {
    header: 'Paciente',
    id: 'patient',
    renderCell: (patient) => <PatientIdentityCell patient={patient} />,
    sortField: 'fullName',
    widthClassName: 'min-w-72',
  },
  {
    header: 'Contacto',
    id: 'contact',
    renderCell: (patient) => <span className="text-ui-text-muted">{patient.phone}</span>,
  },
  {
    header: 'DNI',
    id: 'documentNumber',
    renderCell: (patient) => <span className="font-mono text-ui-text-muted">{patient.documentNumber}</span>,
  },
  {
    header: 'Última visita',
    id: 'lastVisitAt',
    renderCell: (patient) => <span className="font-mono text-ui-text-muted">{formatPatientVisitDate(patient.lastVisitAt)}</span>,
    sortField: 'lastVisitAt',
  },
  {
    align: 'center',
    header: 'Estado',
    id: 'status',
    renderCell: (patient) => (
      <StatusBadge tone={patient.isActive ? 'success' : 'danger'}>{patient.isActive ? 'Activo' : 'Inactivo'}</StatusBadge>
    ),
  },
  {
    align: 'center',
    header: 'Visitas',
    id: 'visits',
    renderCell: (patient) => (
      <span className="inline-flex min-w-10 justify-center rounded-full bg-ui-surface-muted px-3 py-1 text-xs font-black text-ui-text-muted">
        {patient.visits}
      </span>
    ),
  },
  {
    align: 'right',
    header: 'Acciones',
    id: 'actions',
    renderCell: () => (
      <div className="flex justify-end gap-2">
        <Button aria-label="Descargar ficha" Icon={FileDown} iconOnly size="sm" variant="ghost" />
        <Button aria-label="Más acciones" Icon={MoreHorizontal} iconOnly size="sm" variant="ghost" />
      </div>
    ),
  },
]
