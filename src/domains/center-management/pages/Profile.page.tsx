import Text from '@src/shared/ui/atoms/Text.component'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'

function ProfilePage() {
  return (
    <BaseContainer as="main" padding="none" surface="transparent" fullHeight>
      <Text as="h1" variant="title">
        Perfil
      </Text>
      <Text className="mt-2" tone="muted">
        Página de perfil y configuración del centro.
      </Text>
    </BaseContainer>
  )
}

export default ProfilePage
