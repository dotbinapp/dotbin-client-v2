import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'
import { CalendarBody, CalendarHeader } from '../ui/sections'

function CalendarPage() {
  return (
    <BaseContainer as="main" padding="lg" fullHeight>
      <CalendarHeader/>

      <CalendarBody/>
    </BaseContainer>
  )
}

export default CalendarPage
