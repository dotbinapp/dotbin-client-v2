export const APP_PERMISSIONS = {
  DASHBOARD_READ: 'Permite acceder al dashboard y visualizar métricas generales de la operación.',
  CALENDAR_READ: 'Permite acceder a la agenda y consultar turnos, disponibilidad y bloqueos.',
  CALENDAR_EDIT: 'Permite crear y modificar turnos, disponibilidad y bloqueos de agenda.',
  PATIENTS_LIST_READ: 'Permite acceder al listado de pacientes y consultar información resumida.',
  PATIENTS_READ: 'Permite acceder al detalle de un paciente.',
  PATIENTS_PAYMENT_HISTORY_READ: 'Permite acceder al historial de pagos de un paciente.',
  DOCTORS_LIST_READ: 'Permite acceder a la gestión y consulta de profesionales del centro.',
  TREATMENTS_LIST_READ: 'Permite acceder a la gestión y consulta de tratamientos y servicios clínicos.',
  STOCK_READ: 'Permite acceder al inventario, catálogo y movimientos de stock.',
  SETTINGS_READ: 'Permite acceder a la configuración del centro y perfil operativo.',
} as const

export type AppPermission = keyof typeof APP_PERMISSIONS

export const APP_PERMISSION_CODES = Object.fromEntries(
  Object.keys(APP_PERMISSIONS).map((permission) => [permission, permission]),
) as { readonly [Permission in AppPermission]: Permission }

export const APP_PERMISSION_KEYS = Object.keys(APP_PERMISSIONS) as AppPermission[]
