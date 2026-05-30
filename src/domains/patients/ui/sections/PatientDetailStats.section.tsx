import type { PatientDetail } from '@domains/patients/model'
import { StatCard } from '@shared/ui/atoms'
import { AsyncSectionContainer } from '@shared/ui/layout'
import { CalendarClock, CreditCard, DollarSign, ScissorsLineDashed, SquareActivity } from 'lucide-react'
import { formatPatientNextVisit } from '../../utils/patientDate.util'

interface PatientDetailStatsProps {
  isError?: boolean
  isLoading?: boolean
  patient?: PatientDetail
}

const EMPTY_STAT_VALUE = '—'

function PatientDetailStats({ isError = false, isLoading = false, patient }: Readonly<PatientDetailStatsProps>) {
  const hasError = isError || (!isLoading && !patient)

  const patientStats = [
    {
      Icon: SquareActivity,
      iconClassName: 'text-violet-600 dark:text-violet-200',
      iconContainerClassName: 'size-11 rounded-full bg-violet-100 dark:bg-violet-500/15 dark:ring-1 dark:ring-violet-300/25',
      label: 'Visitas totales',
      title: patient?.visits ?? EMPTY_STAT_VALUE,
    },
    {
      Icon: ScissorsLineDashed,
      iconClassName: 'text-pink-600 dark:text-pink-200',
      iconContainerClassName: 'size-11 rounded-full bg-pink-100 dark:bg-pink-500/15 dark:ring-1 dark:ring-pink-300/25',
      label: 'Último tratamiento',
      title: patient?.lastServiceName ?? EMPTY_STAT_VALUE,
    },
    {
      Icon: DollarSign,
      iconClassName: 'text-emerald-600 dark:text-emerald-200',
      iconContainerClassName: 'size-11 rounded-full bg-emerald-100 dark:bg-emerald-500/15 dark:ring-1 dark:ring-emerald-300/25',
      label: 'Total gastado',
      title: EMPTY_STAT_VALUE,
    },
    {
      Icon: CreditCard,
      iconClassName: 'text-orange-600 dark:text-orange-200',
      iconContainerClassName: 'size-11 rounded-full bg-orange-100 dark:bg-orange-500/15 dark:ring-1 dark:ring-orange-300/25',
      label: 'Saldo pendiente',
      title: EMPTY_STAT_VALUE,
    },
    {
      Icon: CalendarClock,
      iconClassName: 'text-purple-600 dark:text-purple-200',
      iconContainerClassName: 'size-11 rounded-full bg-purple-100 dark:bg-purple-500/15 dark:ring-1 dark:ring-purple-300/25',
      label: 'Próximo turno',
      title: formatPatientNextVisit(patient?.nextVisitAt ?? null),
    },
  ]

  return (
    <AsyncSectionContainer
      aria-label="Estadísticas del paciente"
      isError={hasError}
      isLoading={isLoading}
      errorMessage="No se pudieron cargar las estadísticas del paciente."
      padding="none"
      radius="none"
      surface="transparent"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
        {patientStats.map((stat) => (
          <StatCard
            Icon={stat.Icon}
            iconClassName={stat.iconClassName}
            iconContainerClassName={stat.iconContainerClassName}
            key={stat.label}
            label={stat.label}
            title={stat.title}
          />
        ))}
      </div>
    </AsyncSectionContainer>
  )
}

export default PatientDetailStats
