import { CalendarDays } from 'lucide-react'
import { Text } from '@shared/ui/atoms'
import type { PatientTreatmentPlanFrequency } from '@domains/patients/model'
import { getSchedulePreview } from './treatmentPlanForm.utils'

interface TreatmentPlanSchedulePreviewProps {
  frequency: PatientTreatmentPlanFrequency
  startDate: string
  totalSessions: string
}

function TreatmentPlanSchedulePreview({ frequency, startDate, totalSessions }: Readonly<TreatmentPlanSchedulePreviewProps>) {
  const previewSessions = getSchedulePreview(startDate, totalSessions, frequency)
  const remainingSessions = Math.max(Number(totalSessions) - previewSessions.length, 0)

  if (previewSessions.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary-200 bg-primary-50/60 p-3 dark:border-primary-400/30 dark:bg-primary-500/15">
      {previewSessions.map((session, index) => (
        <div className="flex items-center gap-3" key={session.label}>
          {index > 0 ? <span className="hidden w-10 border-t border-dashed border-primary-300 dark:border-primary-300/35 sm:inline-block" aria-hidden="true" /> : null}
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-ui-surface text-ui-primary-text shadow-sm">
              <CalendarDays aria-hidden="true" size={16} />
            </span>
            <div>
              <Text variant="caption" className="text-ui-text">{session.label}</Text>
              <Text variant="caption">{session.date}</Text>
            </div>
          </div>
        </div>
      ))}

      {remainingSessions > 0 ? <Text variant="caption" className="font-black text-ui-primary-text">+{remainingSessions} sesiones más</Text> : null}
    </div>
  )
}

export default TreatmentPlanSchedulePreview
