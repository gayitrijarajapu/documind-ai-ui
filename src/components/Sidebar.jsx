import { FileText, Home, MessageSquareText } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import AppLogo from './AppLogo'

const primaryLinks = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/chat', label: 'AI Chat', icon: MessageSquareText },
]

function Sidebar() {
  return (
    <aside className="hidden h-screen w-[210px] shrink-0 overflow-hidden border-r border-neutral-200 bg-white text-neutral-950 lg:flex lg:flex-col">
      <div className="flex h-14 items-center gap-3 border-b border-neutral-200 px-4">
        <AppLogo className="h-8 w-8 rounded-xl" imageClassName="h-8 w-8" />
        <p className="text-lg font-extrabold tracking-tight">DocuMind AI</p>
      </div>
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {primaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? 'bg-neutral-50 text-neutral-950'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                }`
              }
              key={to}
              to={to}
            >
              <Icon className="h-5 w-5 text-neutral-600" />
              {label}
            </NavLink>
          ))}
        </div>

      </nav>
      <div className="border-t border-neutral-200 px-4 py-5">
        <div className="flex items-center gap-3 text-sm font-semibold text-neutral-600">
          <AppLogo className="h-5 w-5 rounded-sm" imageClassName="h-5 w-5" />
          DocuMind Workspace
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
