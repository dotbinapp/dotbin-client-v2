import { CalendarDays, Clock, DollarSign, Stethoscope } from 'lucide-react'
import { Input, Select } from '@shared/ui/atoms'
import { themeClass } from '@shared/styles/theme.styles'

interface AppointmentCreateFormProps {
  initialValues?: {
    date: string
    startTime: string
  }
}

function AppointmentCreateForm({ initialValues }: Readonly<AppointmentCreateFormProps>) {
  return (
    <form className="space-y-4" id="appointment-create-form">
      <section className="grid grid-cols-2 gap-3" aria-label="Fecha y horario del turno">
        <Input Icon={CalendarDays} defaultValue={initialValues?.date} label="Fecha" name="date" size="compact" type="date" />
        <Input Icon={Clock} defaultValue={initialValues?.startTime} label="Hora inicio" name="startTime" placeholder="HH:mm" size="compact" type="time" />
      </section>

      <section className="grid grid-cols-2 gap-3" aria-label="Duración y costo del turno">
        <Input Icon={Clock} label="Duración (min)" min={0} name="durationMinutes" placeholder="Duración" size="compact" type="number" />
        <Input Icon={DollarSign} label="Costo total (ARS)" min={0} name="totalAmount" placeholder="Total" size="compact" type="number" />
      </section>

      <Select label="Paciente" name="patientId" size="compact">
        <option value="">Seleccionar paciente</option>
      </Select>

      <Select label="Profesional" name="doctorId" size="compact">
        <option value="">Seleccionar profesional</option>
      </Select>

      <Select label="Tratamientos" name="treatmentIds" size="compact">
        <option value="">Seleccionar tratamientos</option>
      </Select>

      <label className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${themeClass.surface.muted} ${themeClass.text.default}`}>
        <input className="size-4 rounded border-ui-border-strong text-primary-600 accent-primary-600" name="isFreeAppointment" type="checkbox" />
        Turno sin costo
      </label>

      <aside className={`rounded-2xl p-4 ${themeClass.surface.inner}`} aria-label="Resumen estimado del turno">
        <div className="flex items-center justify-between gap-4">
          <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${themeClass.text.muted}`}>
            <Clock aria-hidden="true" size={14} />
            Duración estimada
          </span>
          <strong className={`text-sm font-bold ${themeClass.text.default}`}>0h 0min</strong>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${themeClass.text.muted}`}>
            <Stethoscope aria-hidden="true" size={14} />
            Costo estimado
          </span>
          <strong className={`text-base font-bold ${themeClass.text.primary}`}>$ 0</strong>
        </div>
      </aside>
    </form>
  )
}

export default AppointmentCreateForm
