import type { PatientDetail } from '@domains/patients/model'
import { StatCard } from '@shared/ui/atoms'
import { CalendarClock, CreditCard, DollarSign, ScissorsLineDashed, SquareActivity } from 'lucide-react'
import { formatPatientNextVisit } from '../../utils/patientDate.util'

interface PatientDetailStatsProps {
  patient?: PatientDetail
}

const EMPTY_STAT_VALUE = '—'

function PatientDetailStats({ patient }: Readonly<PatientDetailStatsProps>) {
  if (!patient) return null

  const patientStats = [
    {
      Icon: SquareActivity,
      iconClassName: 'text-violet-600',
      iconContainerClassName: 'size-11 rounded-full bg-violet-100',
      label: 'Visitas totales',
      title: patient.visits,
    },
    {
      Icon: ScissorsLineDashed,
      iconClassName: 'text-pink-600',
      iconContainerClassName: 'size-11 rounded-full bg-pink-100',
      label: 'Último tratamiento',
      title: patient.lastServiceName ?? EMPTY_STAT_VALUE,
    },
    {
      Icon: DollarSign,
      iconClassName: 'text-emerald-600',
      iconContainerClassName: 'size-11 rounded-full bg-emerald-100',
      label: 'Total gastado',
      title: EMPTY_STAT_VALUE,
    },
    {
      Icon: CreditCard,
      iconClassName: 'text-orange-600',
      iconContainerClassName: 'size-11 rounded-full bg-orange-100',
      label: 'Saldo pendiente',
      title: EMPTY_STAT_VALUE,
    },
    {
      Icon: CalendarClock,
      iconClassName: 'text-purple-600',
      iconContainerClassName: 'size-11 rounded-full bg-purple-100',
      label: 'Próximo turno',
      title: formatPatientNextVisit(patient.nextVisitAt),
    },
  ]

  return (
    <section aria-label="Estadísticas del paciente">
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
    </section>
  )
}

export default PatientDetailStats
