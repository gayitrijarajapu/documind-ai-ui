import { FileText, PanelLeft, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

function Navbar({ documentsCount, apiStatus }) {
  const location = useLocation()
  const pageTitle = location.pathname.startsWith('/chat')
    ? 'AI Chat'
    : location.pathname.startsWith('/documents')
      ? 'Documents'
      : ''
  const statusLabel =
    apiStatus === 'connected' ? 'FastAPI connected' : apiStatus === 'checking' ? 'Connecting' : 'Backend offline'

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-8 py-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50"
            title="Toggle sidebar"
            type="button"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          {pageTitle && <h1 className="text-xl font-extrabold text-slate-950">{pageTitle}</h1>}
        </div>
        <div className="hidden w-[410px] items-center rounded-xl border border-blue-100 bg-slate-50 px-4 py-2.5 shadow-[0_4px_14px_rgba(37,99,235,0.08)] md:flex">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            className="ml-3 w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
            placeholder="Search documents..."
          />
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-400">
            ⌘ K
          </span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm sm:flex">
            <span className={`h-2.5 w-2.5 rounded-full ${apiStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            {statusLabel}
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm sm:flex">
            <FileText className="h-5 w-5 text-slate-700" />
            {documentsCount} docs
          </div>
          <div className="hidden items-center gap-3 pl-4 xl:flex">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-lg font-bold text-white shadow-sm">
              S
            </span>
            <span className="text-sm font-bold text-slate-950">Sasi Tamada</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
