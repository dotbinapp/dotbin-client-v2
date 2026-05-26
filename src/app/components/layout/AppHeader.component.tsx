import AppBreadcrumb from './AppBreadcrumb.component'
import ProfileMenu from './ProfileMenu.component'
import ThemeModeSwitch from './ThemeModeSwitch.component'

function AppHeader() {
  return (
    <header className="flex min-h-14 items-center justify-between gap-4 border-b border-slate-200/80 py-2 pr-4 pl-8 transition-colors duration-200 dark:border-slate-800/80 dark:bg-slate-950/30">
      <div className="min-w-0 flex-1">
        <AppBreadcrumb />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ThemeModeSwitch />
        <ProfileMenu />
      </div>
    </header>
  )
}

export default AppHeader
