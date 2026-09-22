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
    <aside className="hidden h-screen w-[260px] shrink-0 overflow-hidden border-r border-slate-200 bg-white text-slate-950 shadow-[8px_0_30px_rgba(15,23,42,0.04)] lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-7">
        <AppLogo className="h-8 w-8 rounded-xl" imageClassName="h-8 w-8" />
        <p className="text-xl font-extrabold tracking-tight">DocuMind AI</p>
      </div>
      <nav className="flex-1 px-5 py-5">
        <div className="space-y-2">
          {primaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-2xl px-4 py-3 text-base font-bold transition ${
                  isActive
                    ? 'bg-blue-50 text-slate-950 shadow-[inset_0_0_0_1px_rgba(219,234,254,0.9)]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`
              }
              key={to}
              to={to}
            >
              <Icon className="h-5 w-5 text-blue-600" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <p className="text-base font-extrabold text-slate-950">How it works</p>
          <p className="mt-2 text-base leading-6 text-slate-500">
            Upload PDFs, open a document, then ask questions with page references.
          </p>
        </div>
      </nav>
      <div className="border-t border-slate-200 px-7 py-5">
        <div className="flex items-center gap-3 text-base font-bold text-slate-600">
          <AppLogo className="h-5 w-5 rounded-sm" imageClassName="h-5 w-5" />
          DocuMind Workspace
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
