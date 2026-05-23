import { useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import type { IdentityAccessPermission, PermissionCheck } from '../model/identityAccessPermissions.types'
import { APP_PERMISSION_KEYS } from '../model/appPermissions.constants'

const AUTH0_PERMISSION_CLAIMS = ['permissions', 'https://dotbin.app/permissions'] as const
const KNOWN_PERMISSION_KEYS = new Set<IdentityAccessPermission>(APP_PERMISSION_KEYS)

type Auth0UserClaims = Record<string, unknown>

function isPermission(value: unknown): value is IdentityAccessPermission {
  return typeof value === 'string' && KNOWN_PERMISSION_KEYS.has(value as IdentityAccessPermission)
}

function readPermissionClaim(user: Auth0UserClaims | undefined): readonly IdentityAccessPermission[] {
  if (!user) {
    return []
  }

  const permissions = AUTH0_PERMISSION_CLAIMS.flatMap((claim) => {
    const value = user[claim]

    return Array.isArray(value) ? value.filter(isPermission) : []
  })

  return [...new Set(permissions)]
}

export function hasPermission(permissions: readonly IdentityAccessPermission[] | undefined, code: IdentityAccessPermission): boolean {
  return permissions?.includes(code) ?? false
}

export function hasAnyPermission(
  permissions: readonly IdentityAccessPermission[] | undefined,
  codes: readonly IdentityAccessPermission[],
): boolean {
  return codes.length > 0 && codes.some((code) => hasPermission(permissions, code))
}

export function checkPermissionAccess(
  permissions: readonly IdentityAccessPermission[] | undefined,
  requiredPermission?: IdentityAccessPermission,
  requiredPermissions?: readonly IdentityAccessPermission[],
): PermissionCheck {
  if (!requiredPermission && !requiredPermissions?.length) {
    return { hasAccess: true, missingPermissions: [] }
  }

  if (requiredPermissions?.length) {
    return {
      hasAccess: hasAnyPermission(permissions, requiredPermissions),
      missingPermissions: requiredPermissions.filter((permission) => !hasPermission(permissions, permission)),
    }
  }

  if (!requiredPermission) {
    return { hasAccess: true, missingPermissions: [] }
  }

  return {
    hasAccess: hasPermission(permissions, requiredPermission),
    missingPermissions: hasPermission(permissions, requiredPermission) ? [] : [requiredPermission],
  }
}

export function usePermissions() {
  const { user } = useAuth0<Auth0UserClaims>()
  const permissions = useMemo(() => readPermissionClaim(user), [user])

  return useMemo(
    () => ({
      permissions,
      checkAccess: (requiredPermission?: IdentityAccessPermission, requiredPermissions?: readonly IdentityAccessPermission[]) =>
        checkPermissionAccess(permissions, requiredPermission, requiredPermissions),
      hasAnyPermission: (codes: readonly IdentityAccessPermission[]) => hasAnyPermission(permissions, codes),
      hasPermission: (code: IdentityAccessPermission) => hasPermission(permissions, code),
    }),
    [permissions],
  )
}
