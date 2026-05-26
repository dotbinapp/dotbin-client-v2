import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useLogout } from '@domains/identity-access'
import { Button } from '@shared/ui/atoms'
import { ConfirmModal } from '@shared/ui/molecules'

interface SidebarFooterProps {
  onLogoutClick?: () => void
}

function SidebarFooter({ onLogoutClick }: Readonly<SidebarFooterProps>) {
  const [openLogoutModal, setOpenLogoutModal] = useState(false)
  const logout = useLogout()

  const handleConfirmLogout = () => {
    if (onLogoutClick) {
      onLogoutClick()
      return
    }

    logout()
  }

  return (
    <div className="p-3 z-10 relative">
      <Button
        aria-label="Cerrar sesión"
        fullWidth
        iconOnly
        Icon={LogOut}
        onClick={() => setOpenLogoutModal(true)}
        title="Cerrar sesión"
        variant="ghost"
        className='text-red-500 hover:bg-red-100'
      />
      {openLogoutModal ? (
        <ConfirmModal
          description="¿Estás seguro de que querés cerrar sesión?"
          Icon={LogOut}
          onClose={() => setOpenLogoutModal(false)}
          onConfirm={handleConfirmLogout}
          primaryAction="danger"
          title="Cerrar sesión"
        />
      ) : null}
    </div>
  )
}

export default SidebarFooter
