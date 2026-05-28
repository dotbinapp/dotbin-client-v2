import { BadgeDollarSign, ClipboardList, Clock, HandCoins, MoreVertical, Pencil, Sparkles, SquaresSubtract, Tags, Trash2 } from 'lucide-react'
import type { ServiceListSortField, ServiceSummary } from '@domains/services/model'
import { formatCostInput } from '@shared/utils'
import { MenuButton } from '@shared/ui/molecules'
import type { BaseTableColumn } from '@shared/ui/organisms'

interface ServiceTableColumnsParams {
  onEditService: (service: ServiceSummary) => void
}

function formatServiceDuration(durationMinutes: number) {
  return `${durationMinutes} min`
}

function getServiceConditionBadges(service: ServiceSummary) {
  const conditionBadges = []

  if (service.requiresDeposit && service.depositAmount !== null) {
    conditionBadges.push(
      <span className="inline-flex items-center gap-1 rounded-full bg-ui-primary-soft px-2.5 py-1 text-xs font-black text-ui-primary-text" key="deposit">
        <HandCoins aria-hidden="true" size={13} />
        Seña $ {formatCostInput(service.depositAmount)}
      </span>,
    )
  }

  if (service.hasPostServiceInstructions) {
    conditionBadges.push(
      <span className="inline-flex items-center gap-1 rounded-full bg-ui-surface-muted px-2.5 py-1 text-xs font-black text-ui-text-muted" key="post-service">
        <ClipboardList aria-hidden="true" size={13} />
        Post-servicio
      </span>,
    )
  }

  return conditionBadges
}

export function getServiceTableColumns({ onEditService }: ServiceTableColumnsParams): BaseTableColumn<ServiceSummary, ServiceListSortField>[] {
  return [{
    HeaderIcon: Sparkles,
    id: 'service',
    label: 'Servicio',
    renderCell: (service) => (
      <div className="w-72 max-w-72 min-w-0">
        <span className="block truncate font-bold text-ui-text-default" title={service.name}>{service.name}</span>
        <span className="mt-1 block truncate text-xs font-medium text-ui-text-subtle" title={service.description ?? undefined}>
          {service.description ?? 'Sin descripción cargada'}
        </span>
      </div>
    ),
    sortField: 'name',
    widthClassName: 'w-72 max-w-72',
  },
  {
    HeaderIcon: BadgeDollarSign,
    id: 'cost',
    label: 'Costo',
    renderCell: (service) => <span className="font-bold text-ui-text-default">$ {formatCostInput(service.cost)}</span>,
    sortField: 'price',
  },
  {
    HeaderIcon: Clock,
    id: 'duration',
    label: 'Duración',
    renderCell: (service) => <span className="text-ui-text-muted">{formatServiceDuration(service.durationMinutes)}</span>,
    sortField: 'durationMinutes',
  },
  {
    HeaderIcon: Tags,
    id: 'category',
    label: 'Categoría',
    renderCell: (service) => (
      <span className="inline-flex rounded-full bg-ui-surface-muted px-3 py-1 text-xs font-black text-ui-text-muted">
        {service.category ?? '-'}
      </span>
    ),
  },
  {
    HeaderIcon: ClipboardList,
    id: 'conditions',
    label: 'Condiciones',
    renderCell: (service) => {
      const conditionBadges = getServiceConditionBadges(service)

      if (conditionBadges.length === 0) {
        return <span className="text-ui-text-subtle">—</span>
      }

      return <div className="flex max-w-72 flex-wrap gap-1.5">{conditionBadges}</div>
    },
    widthClassName: 'min-w-64',
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
            { Icon: Pencil, label: 'Editar servicio', onSelect: () => onEditService(service) },
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
}
