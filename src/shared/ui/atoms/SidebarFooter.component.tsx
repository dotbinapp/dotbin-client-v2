import { LogOut } from 'lucide-react'

interface SidebarFooterProps {
  onLogoutClick?: () => void
}

function SidebarFooter({ onLogoutClick }: Readonly<SidebarFooterProps>) {
  return (
    <div className="p-3 z-10 relative">
      <button
        type="button"
        onClick={onLogoutClick}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
        className="w-full flex items-center justify-center py-3 text-slate-500 hover:text-red-500 transition-all rounded-2xl hover:bg-red-50/50 border border-transparent hover:border-red-100/50 group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!onLogoutClick}
      >
        <LogOut size={20} aria-hidden="true" className="flex-shrink-0 transition-transform" />
      </button>
    </div>
  )
}

export default SidebarFooter
