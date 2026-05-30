import type { ComponentProps, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import Button from '../atoms/Button.component'
import Skeleton from '../atoms/Skeleton.component'
import Text from '../atoms/Text.component'
import BaseContainer from './BaseContainer.component'
import type { BaseContainerPadding, BaseContainerRadius, BaseContainerSurface } from './BaseContainer.component'

interface AsyncSectionContainerProps extends Omit<ComponentProps<'section'>, 'children'> {
  children: ReactNode
  errorFallback?: ReactNode
  errorMessage?: ReactNode
  fullHeight?: boolean
  isError?: boolean
  isLoading?: boolean
  loadingFallback?: ReactNode
  onRetry?: () => void
  padding?: BaseContainerPadding
  radius?: BaseContainerRadius
  surface?: BaseContainerSurface
}

function DefaultLoadingFallback() {
  return (
    <div aria-label="Cargando sección" className="space-y-3">
      <Skeleton size="md" className="max-w-48" />
      <Skeleton size="lg" />
      <Skeleton size="lg" />
    </div>
  )
}

function DefaultErrorFallback({ errorMessage, onRetry }: Pick<AsyncSectionContainerProps, 'errorMessage' | 'onRetry'>) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center" role="alert">
      <AlertCircle aria-hidden="true" className="mx-auto mb-3 text-red-600" size={24} />
      <Text variant="body" tone="danger">{errorMessage ?? 'No se pudo cargar esta sección.'}</Text>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} size="sm" variant="secondary">
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}

function AsyncSectionContainer({
  children,
  errorFallback,
  errorMessage,
  isError = false,
  isLoading = false,
  loadingFallback,
  onRetry,
  ...props
}: Readonly<AsyncSectionContainerProps>) {
  return (
    <BaseContainer as="section" aria-busy={isLoading || undefined} {...props}>
      {isLoading ? (loadingFallback ?? <DefaultLoadingFallback />) : null}
      {!isLoading && isError ? (errorFallback ?? <DefaultErrorFallback errorMessage={errorMessage} onRetry={onRetry} />) : null}
      {!isLoading && !isError ? children : null}
    </BaseContainer>
  )
}

export default AsyncSectionContainer
