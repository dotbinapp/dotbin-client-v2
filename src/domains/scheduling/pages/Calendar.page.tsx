import { useState } from 'react'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'
import { CalendarBody, CalendarHeader } from '../ui/sections'
import { toIsoDateValue } from '../utils/weekPicker.utils'
import type { CalendarSlotIntent } from '../model/scheduling.types'

interface SlotSelection {
  date: string
  intent: CalendarSlotIntent
  startTime: string
}

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(() => toIsoDateValue(new Date()))
  const [slotSelection, setSlotSelection] = useState<SlotSelection | null>(null)

  return (
    <BaseContainer as="main" className="flex min-h-0 flex-col" padding="none" surface="transparent" fullHeight>
      <CalendarHeader
        selectedDate={selectedDate}
        slotSelection={slotSelection}
        onDateChange={setSelectedDate}
        onSlotSelectionConsumed={() => setSlotSelection(null)}
      />

      <CalendarBody
        selectedDate={selectedDate}
        onSlotIntent={(day, startTime, intent) => {
          setSlotSelection({ date: toIsoDateValue(day), intent, startTime })
        }}
      />
    </BaseContainer>
  )
}

export default CalendarPage
