import { BrowserRouter } from 'react-router-dom'
import { APP_SIDEBAR_NAVIGATION_ITEMS } from './router/sidebarNavigation.constants'
import AppSidebar from '../shared/ui/organisms/AppSidebar.component'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen p-4">
        <div className="mesh-bg" />
        <div className="flex min-h-[calc(100vh-2rem)] gap-4">
          <AppSidebar items={APP_SIDEBAR_NAVIGATION_ITEMS} />

          <main className="flex-1 rounded-[2rem] glass-panel p-8">
            <h1 className="text-3xl font-bold text-slate-800">Dotbin Client 2</h1>
            <p className="mt-2 text-slate-600">Layout base inicial para la migración por dominios.</p>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
