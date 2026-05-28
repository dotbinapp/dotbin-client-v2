import { Copy, Mail, MoreVertical, Pencil, Phone, SquaresSubtract, Stethoscope, Trash2, UserRound } from 'lucide-react'
import type { ProfessionalSummary } from '@domains/professionals/model'
import { toast } from '@shared/ui/feedback'
import { MenuButton } from '@shared/ui/molecules'
import type { MenuButtonOption } from '@shared/ui/molecules'
import type { BaseTableColumn } from '@shared/ui/organisms'
import type { ProfessionalTableSortField } from './professionalTable.types'
import { getProfessionalWhatsAppUrl } from './professionalTable.utils'

interface ProfessionalTableColumnsParams {
  canEditProfessional: boolean
  onDeleteProfessional: (professional: ProfessionalSummary) => void
  onEditProfessional: (professional: ProfessionalSummary) => void
}

function getProfessionalActions({ onDeleteProfessional, onEditProfessional }: ProfessionalTableColumnsParams, professional: ProfessionalSummary) {
  const actions: MenuButtonOption[] = [
    { Icon: Pencil, label: 'Editar profesional', onSelect: () => onEditProfessional(professional) },
    { Icon: Trash2, label: 'Eliminar profesional', onSelect: () => onDeleteProfessional(professional), tone: 'danger' },
  ]

  return actions
}

async function copyProfessionalEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email)
    toast.success('Email copiado', {
      description: `${email} copiado al portapapeles.`,
    })
  } catch {
    toast.error('No se pudo copiar el email')
  }
}

export function getProfessionalTableColumns(params: ProfessionalTableColumnsParams): BaseTableColumn<ProfessionalSummary, ProfessionalTableSortField>[] {
  const { canEditProfessional } = params
  const columns: BaseTableColumn<ProfessionalSummary, ProfessionalTableSortField>[] = [
    {
      HeaderIcon: UserRound,
      id: 'professional',
      label: 'Nombre',
      renderCell: (professional) => <span className="font-bold text-ui-text-default">{professional.fullName}</span>,
      sortField: 'fullName',
      widthClassName: 'min-w-72',
    },
    {
      HeaderIcon: Stethoscope,
      id: 'specialty',
      label: 'Especialidad',
      renderCell: (professional) => professional.specialty ? <span className="text-ui-text-muted">{professional.specialty}</span> : <span className="text-ui-text-subtle">—</span>,
      sortField: 'specialty',
    },
    {
      HeaderIcon: Mail,
      id: 'email',
      label: 'Email',
      renderCell: (professional) =>
        professional.email ? (
          <div className="flex w-72 max-w-72 items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-ui-text-muted" title={professional.email}>{professional.email}</span>
            <button
              aria-label={`Copiar email de ${professional.fullName}`}
              className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ui-text-subtle transition-colors hover:bg-ui-surface-hover hover:text-ui-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
              onClick={() => void copyProfessionalEmail(professional.email as string)}
              type="button"
            >
              <Copy aria-hidden="true" size={14} />
            </button>
          </div>
        ) : (
          <span className="text-ui-text-subtle">—</span>
        ),
      sortField: 'email',
      widthClassName: 'w-72 max-w-72',
    },
    {
      HeaderIcon: Phone,
      id: 'phone',
      label: 'Teléfono',
      renderCell: (professional) =>
        professional.phone ? (
          <a
            className="text-ui-text-muted underline underline-offset-4 transition-colors hover:text-ui-primary-text"
            href={getProfessionalWhatsAppUrl(professional.phone)}
            rel="noreferrer"
            target="_blank"
          >
            {professional.phone}
          </a>
        ) : (
          <span className="text-ui-text-subtle">—</span>
        ),
    },
  ]

  if (!canEditProfessional) return columns

  return [
    ...columns,
    {
      HeaderIcon: SquaresSubtract,
      align: 'center',
      id: 'actions',
      label: 'Acciones',
      renderCell: (professional) => (
        <div className="flex justify-center gap-2">
          <MenuButton
            aria-label={`Acciones de ${professional.fullName}`}
            Icon={MoreVertical}
            iconOnly
            options={getProfessionalActions(params, professional)}
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
