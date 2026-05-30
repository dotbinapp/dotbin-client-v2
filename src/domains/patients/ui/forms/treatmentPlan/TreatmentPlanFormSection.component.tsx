import type { ReactNode } from 'react'
import { themeClass } from '@shared/styles/theme.styles'

interface TreatmentPlanFormSectionProps {
  children: ReactNode
  title: string
}

function TreatmentPlanFormSection({ children, title }: Readonly<TreatmentPlanFormSectionProps>) {
  return (
    <fieldset className={`rounded-2xl border p-4 ${themeClass.border.default}`}>
      <legend className="px-2 text-sm font-black text-ui-primary-text">{title}</legend>
      <div className="mt-3 space-y-4">{children}</div>
    </fieldset>
  )
}

export default TreatmentPlanFormSection
