import { LogOut } from 'lucide-react'
import Button from '@src/shared/ui/atoms/Button.component'

interface SidebarFooterProps {
  onLogoutClick?: () => void
}

function SidebarFooter({ onLogoutClick }: Readonly<SidebarFooterProps>) {
  return (
    <div className="p-3 z-10 relative">
      <Button
        aria-label="Cerrar sesión"
        disabled={!onLogoutClick}
        fullWidth
        iconOnly
        Icon={LogOut}
        onClick={onLogoutClick}
        title="Cerrar sesión"
        variant="danger"
      />
    </div>
  )
}

export default SidebarFooter
