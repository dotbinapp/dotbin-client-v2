import { BadgeDollarSign, Clock, MoreVertical, Pencil, Sparkles, SquaresSubtract, Tags, Trash2 } from 'lucide-react'
import type { ServiceSummary } from '@domains/services/model'
import { formatCostInput } from '@shared/utils'
import { MenuButton } from '@shared/ui/molecules'
import type { BaseTableColumn } from '@shared/ui/organisms'

export const SERVICE_TABLE_PREVIEW_ROWS: ServiceSummary[] = [
  {
    category: 'Facial',
    cost: 28000,
    description: 'Limpieza facial profunda con extracción y máscara calmante.',
    durationMinutes: 60,
    id: 'service-preview-1',
    name: 'Limpieza facial profunda',
  },
  {
    category: 'Dermocosmética',
    cost: 45000,
    description: 'Peeling químico superficial para renovación de piel.',
    durationMinutes: 45,
    id: 'service-preview-2',
    name: 'Peeling químico',
  },
  {
    category: 'Aparatología',
    cost: 52000,
    description: 'Sesión de radiofrecuencia para tonificación y firmeza.',
    durationMinutes: 50,
    id: 'service-preview-3',
    name: 'Radiofrecuencia facial',
  },
  {
    category: 'Láser',
    cost: 36000,
    description: null,
    durationMinutes: 40,
    id: 'service-preview-4',
    name: 'Depilación láser axilas',
  },
]

function formatServiceDuration(durationMinutes: number) {
  return `${durationMinutes} min`
}

export const SERVICE_TABLE_COLUMNS: BaseTableColumn<ServiceSummary>[] = [
  {
    HeaderIcon: Sparkles,
    id: 'service',
    label: 'Servicio',
    renderCell: (service) => (
      <div className="max-w-80">
        <span className="block font-bold text-ui-text-default">{service.name}</span>
        <span className="mt-1 block truncate text-xs font-medium text-ui-text-subtle">
          {service.description ?? 'Sin descripción cargada'}
        </span>
      </div>
    ),
    widthClassName: 'min-w-80',
  },
  {
    HeaderIcon: BadgeDollarSign,
    id: 'cost',
    label: 'Costo',
    renderCell: (service) => <span className="font-bold text-ui-text-default">$ {formatCostInput(service.cost)}</span>,
  },
  {
    HeaderIcon: Clock,
    id: 'duration',
    label: 'Duración',
    renderCell: (service) => <span className="text-ui-text-muted">{formatServiceDuration(service.durationMinutes)}</span>,
  },
  {
    HeaderIcon: Tags,
    id: 'category',
    label: 'Categoría',
    renderCell: (service) => (
      <span className="inline-flex rounded-full bg-ui-surface-muted px-3 py-1 text-xs font-black text-ui-text-muted">
        {service.category}
      </span>
    ),
  },
  {
    HeaderIcon: SquaresSubtract,
    align: 'center',
    id: 'actions',
    label: 'Acciones',
    renderCell: (service) => (
      <div className="flex justify-center gap-2">
        <MenuButton
          aria-label={`Acciones de ${service.name}`}
          Icon={MoreVertical}
          iconOnly
          options={[
            { Icon: Pencil, label: 'Editar servicio', onSelect: () => undefined },
            { Icon: Trash2, label: 'Eliminar servicio', onSelect: () => undefined },
          ]}
          panelOffset="tight"
          panelPlacement="bottom-end"
          size="sm"
          triggerSize="sm"
          variant="ghost"
        />
      </div>
    ),
  },
]
