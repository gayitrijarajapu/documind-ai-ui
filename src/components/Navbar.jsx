import { FileText, PanelLeft, Search } from 'lucide-react'

function Navbar({ documentsCount, apiStatus }) {
  const statusLabel =
    apiStatus === 'connected' ? 'FastAPI connected' : apiStatus === 'checking' ? 'Connecting' : 'Demo data'

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white px-4 py-2.5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-50"
            title="Toggle sidebar"
            type="button"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-semibold text-neutral-950">Dashboard</h1>
        </div>
        <div className="hidden w-[300px] items-center rounded-xl border border-neutral-200 bg-white px-3 py-1.5 md:flex">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            placeholder="Search documents..."
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 sm:flex">
            <span className="h-2 w-2 rounded-full bg-black" />
            {statusLabel}
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 sm:flex">
            <FileText className="h-4 w-4 text-neutral-950" />
            {documentsCount} docs
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
