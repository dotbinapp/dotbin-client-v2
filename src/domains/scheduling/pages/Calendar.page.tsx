import Text from '@src/shared/ui/atoms/Text.component'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'
import { CalendarHeader } from '../ui/sections'

function CalendarPage() {
  return (
    <BaseContainer as="main" padding="lg" fullHeight>
      <CalendarHeader/>
      <Text className="mt-2" tone="muted">
        Página de agenda, turnos y disponibilidad.
      </Text>
    </BaseContainer>
  )
}

export default CalendarPage
