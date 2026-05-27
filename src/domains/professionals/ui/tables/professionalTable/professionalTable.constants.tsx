import { Mail, MoreVertical, Pencil, Phone, SquaresSubtract, Stethoscope, UserRound } from 'lucide-react'
import type { ProfessionalSummary } from '@domains/professionals/model'
import { MenuButton } from '@shared/ui/molecules'
import type { BaseTableColumn } from '@shared/ui/organisms'
import type { ProfessionalTableSortField } from './professionalTable.types'
import { getProfessionalWhatsAppUrl } from './professionalTable.utils'

interface ProfessionalTableColumnsParams {
  onEditProfessional?: (professional: ProfessionalSummary) => void
}

export function getProfessionalTableColumns({ onEditProfessional }: ProfessionalTableColumnsParams): BaseTableColumn<ProfessionalSummary, ProfessionalTableSortField>[] {
  return [
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
          <a
            className="text-ui-text-muted underline underline-offset-4 transition-colors hover:text-ui-primary-text"
            href={`mailto:${professional.email}`}
          >
            {professional.email}
          </a>
        ) : (
          <span className="text-ui-text-subtle">—</span>
        ),
      sortField: 'email',
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
    {
      HeaderIcon: SquaresSubtract,
      align: 'center',
      id: 'actions',
      label: 'Acciones',
      renderCell: (professional) => (
        <div className="flex justify-center gap-2">
          {onEditProfessional ? (
            <MenuButton
              aria-label={`Acciones de ${professional.fullName}`}
              Icon={MoreVertical}
              iconOnly
              options={[{ Icon: Pencil, label: 'Editar profesional', onSelect: () => onEditProfessional(professional) }]}
              panelOffset="tight"
              panelPlacement="bottom-end"
              size="sm"
              triggerSize="sm"
              variant="ghost"
            />
          ) : (
            <span className="text-ui-text-subtle">—</span>
          )}
        </div>
      ),
    },
  ]
}
