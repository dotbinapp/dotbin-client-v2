import { LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CENTER_MANAGEMENT_PROFILE_ROUTE_PATH } from '@domains/center-management'
import { MenuButton } from '@shared/ui/molecules'

const PROFILE_AVATAR_SRC =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="18" x2="78" y1="12" y2="84" gradientUnits="userSpaceOnUse"%3E%3Cstop stop-color="%23c084fc"/%3E%3Cstop offset="1" stop-color="%237e22ce"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="96" height="96" rx="28" fill="url(%23a)"/%3E%3Ccircle cx="48" cy="38" r="16" fill="%23fff" fill-opacity=".92"/%3E%3Cpath fill="%23fff" fill-opacity=".92" d="M21 82c4-17 14-27 27-27s23 10 27 27H21Z"/%3E%3C/svg%3E'

function ProfileMenu() {
  const navigate = useNavigate()

  const profileMenuOptions = [
    {
      Icon: Settings,
      label: 'Configurar cuenta',
      onSelect: () => navigate(CENTER_MANAGEMENT_PROFILE_ROUTE_PATH),
    },
    {
      Icon: LogOut,
      label: 'Cerrar sesión',
      onSelect: () => {},
    },
  ]

  return (
    <MenuButton
      aria-label="Abrir opciones de perfil"
      className="size-10 overflow-visible rounded-full border border-slate-200/80 bg-white/65 p-0 shadow-sm shadow-slate-900/5 hover:bg-white"
      options={profileMenuOptions}
      size="icon"
      variant="ghost"
    >
      <span className="relative inline-flex size-9 items-center justify-center rounded-full">
        <img alt="Perfil de usuario" className="size-9 rounded-full object-cover ring-2 ring-white" src={PROFILE_AVATAR_SRC} />
        <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-400" />
      </span>
    </MenuButton>
  )
}

export default ProfileMenu
