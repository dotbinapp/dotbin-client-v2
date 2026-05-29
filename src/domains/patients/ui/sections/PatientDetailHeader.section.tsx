import type { PatientDetail } from '@domains/patients/model'
import { Button, StatItem, Tabs, Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'
import { Activity, AtSign, CalendarCheck, CalendarClock, ClipboardList, History, IdCard, Pencil, Phone, ScissorsLineDashed, UserRound } from 'lucide-react'
import {
  calculatePatientAge,
  formatPatientBirthDate,
  formatPatientDate,
  formatPatientDocumentNumber,
  formatPatientNextVisit,
  getPatientInitials,
} from '../../utils/patientDate.util'

interface PatientDetailHeaderProps {
  canEditPatient?: boolean
  canViewPatient: boolean
  isError: boolean
  isLoading: boolean
  onEditProfile?: () => void
  patient?: PatientDetail
}

function PatientDetailHeader({ canEditPatient = false, canViewPatient, isError, isLoading, onEditProfile, patient }: PatientDetailHeaderProps) {
  if (!canViewPatient) {
    return (
      <BaseContainer surface="subtle" radius="lg">
        <Text variant="body">No tenés permisos para ver este paciente.</Text>
      </BaseContainer>
    )
  }

  if (isLoading) {
    return (
      <BaseContainer surface="subtle" radius="lg">
        <Text variant="body">Cargando paciente…</Text>
      </BaseContainer>
    )
  }

  if (isError || !patient) {
    return (
      <BaseContainer surface="subtle" radius="lg">
        <Text variant="body">No se pudo cargar el paciente.</Text>
      </BaseContainer>
    )
  }

  const patientStats = [
    { Icon: CalendarCheck, label: 'Última visita', title: formatPatientDate(patient.lastVisitAt) },
    { Icon: CalendarClock, label: 'Próximo turno', title: formatPatientNextVisit(patient.nextVisitAt) },
    { Icon: ScissorsLineDashed, label: 'Tratamiento principal', title: patient.lastServiceName ?? '—' },
    { Icon: ClipboardList, label: 'Total visitas', title: patient.visits },
  ]
  const patientDetailTabs = [
    { Icon: UserRound, label: 'Resumen', path: `/patients/${patient.id}` },
    { Icon: ClipboardList, label: 'Planes', path: `/patients/${patient.id}/plans` },
    { Icon: Activity, label: 'Evolución', path: `/patients/${patient.id}/evolution` },
    { Icon: History, label: 'Historial de servicios', path: `/patients/${patient.id}/history` },
  ]

  return (
    <BaseContainer surface="solid" radius="lg" className="relative py-4!">
      {canEditPatient ? (
        <div className="mb-4 flex justify-end md:absolute md:right-4 md:top-4 md:mb-0">
          <Button Icon={Pencil} onClick={onEditProfile} size="sm" variant="secondary">
            Editar perfil
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:pr-40">
        <div className="flex h-30 w-30 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xl font-black text-ui-text-muted">
          {getPatientInitials(patient.fullName)}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Text as="h1" variant="title">{patient.fullName}</Text>

            <Text variant="caption" className="flex items-center gap-3">
              <span>{calculatePatientAge(patient.dateOfBirth)}</span>
              <span aria-hidden="true">•</span>
              <span>{formatPatientBirthDate(patient.dateOfBirth)}</span>
            </Text>
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex min-w-80 flex-col gap-3 border-ui-border-muted pr-0 lg:border-r lg:pr-12">
              <Text variant="caption" className="flex items-center gap-3">
                <Phone aria-hidden="true" size={14} />
                {patient.phone ?? '—'}
              </Text>
              <Text variant="caption" className="flex items-center gap-3">
                <AtSign aria-hidden="true" size={14} />
                {patient.instagramAccount ?? '—'}
              </Text>
              <Text variant="caption" className="flex items-center gap-3">
                <IdCard aria-hidden="true" size={14} />
                {formatPatientDocumentNumber(patient.documentNumber)}
              </Text>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {patientStats.map((stat) => (
                <StatItem Icon={stat.Icon} key={stat.label} label={stat.label} title={stat.title} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 border-t border-ui-border pt-1">
        <Tabs ariaLabel="Secciones del paciente" tabs={patientDetailTabs} />
      </div>
    </BaseContainer>
  )
}

export default PatientDetailHeader
