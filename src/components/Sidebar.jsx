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
    <aside className="hidden h-screen w-[260px] shrink-0 overflow-hidden border-r border-neutral-200 bg-neutral-50 text-neutral-950 lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-neutral-200 px-4">
        <AppLogo className="h-7 w-7 rounded-md" imageClassName="h-7 w-7" />
        <p className="text-lg font-bold tracking-tight">DocuMind AI</p>
      </div>
      <nav className="flex-1 px-3 py-3">
        <div className="space-y-1">
          {primaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-neutral-200 text-neutral-950'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
                }`
              }
              key={to}
              to={to}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-neutral-200 bg-white p-3">
          <p className="text-sm font-semibold text-neutral-950">How it works</p>
          <p className="mt-1 text-sm leading-5 text-neutral-500">
            Upload PDFs, open a document, then ask questions with page references.
          </p>
        </div>
      </nav>
      <div className="border-t border-neutral-200 px-3 py-3">
        <div className="flex items-center gap-3 px-3 py-1.5 text-sm font-medium text-neutral-500">
          <AppLogo className="h-5 w-5 rounded-sm" imageClassName="h-5 w-5" />
          DocuMind Workspace
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
