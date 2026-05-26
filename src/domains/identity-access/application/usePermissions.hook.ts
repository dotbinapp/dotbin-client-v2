import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { IdentityAccessPermission, PermissionCheck } from '../model/identityAccessPermissions.types'
import { selectSessionPermissions } from '../state/session.selectors'

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
  const permissions = useSelector(selectSessionPermissions)

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
