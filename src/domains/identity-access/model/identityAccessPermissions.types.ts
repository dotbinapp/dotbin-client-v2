import type { AppPermission } from './appPermissions.constants'

export type IdentityAccessPermission = AppPermission

export type PermissionCheck = {
  hasAccess: boolean
  missingPermissions: readonly IdentityAccessPermission[]
}
