import { Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'

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
