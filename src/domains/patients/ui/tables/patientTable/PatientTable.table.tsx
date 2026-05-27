import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Pill } from '@shared/ui/atoms'
import { BaseTable } from '@shared/ui/organisms'
import type { BaseTableSortState } from '@shared/ui/organisms'
import { MOCK_PATIENTS, PATIENT_STATUS_FILTERS, PATIENT_TABLE_COLUMNS } from './patientTable.constants'
import type { PatientStatusFilter, PatientTableSortField } from './patientTable.types'
import { getVisiblePatients } from './patientTable.utils'

function PatientTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PatientStatusFilter>('all')
  const [sortState, setSortState] = useState<BaseTableSortState<PatientTableSortField>>(null)

  const visiblePatients = useMemo(
    () => getVisiblePatients(MOCK_PATIENTS, searchTerm, statusFilter, sortState),
    [searchTerm, sortState, statusFilter],
  )

  return (
    <BaseTable
      actions={
        <Button Icon={Plus} size="sm">
          Crear paciente
        </Button>
      }
      columns={PATIENT_TABLE_COLUMNS}
      emptyMessage="No hay pacientes para mostrar"
      filters={
        <>
          {PATIENT_STATUS_FILTERS.map((filter) => (
            <Pill
              active={statusFilter === filter.value}
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Pill>
          ))}
        </>
      }
      onSearchChange={setSearchTerm}
      onSortChange={setSortState}
      rowKey={(patient) => patient.id}
      rows={visiblePatients}
      searchPlaceholder="Buscar por nombre o DNI..."
      sortState={sortState}
    />
  )
}

export default PatientTable
