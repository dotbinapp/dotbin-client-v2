import Text from '@src/shared/ui/atoms/Text.component'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'

function StocksPage() {
  return (
    <BaseContainer as="main" padding="lg" fullHeight>
      <Text as="h1" variant="title">
        Stocks
      </Text>
      <Text className="mt-2" tone="muted">
        Página de profesionales y disponibilidad profesional.
      </Text>
    </BaseContainer>
  )
}

export default StocksPage
