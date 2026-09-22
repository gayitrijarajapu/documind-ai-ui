import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Home, MessageSquareText, FileText, Search } from 'lucide-react'

function Navbar({ documentsCount, apiStatus }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const searchDocuments = (value) => {
    const params = new URLSearchParams()
    if (value) params.set('q', value)
    navigate({ pathname: '/documents', search: params.toString() }, { replace: true })
  }
  const statusLabel =
    apiStatus === 'connected' ? 'FastAPI connected' : apiStatus === 'checking' ? 'Connecting' : 'Backend offline'

  return (
    <header className="sticky top-0 z-20 shrink-0 bg-white px-5 py-3">
      <nav aria-label="Mobile navigation" className="flex w-full items-center gap-2 lg:hidden">
        {[
          { to: '/', label: 'Home', icon: Home },
          { to: '/documents', label: 'Documents', icon: FileText },
          { to: '/chat', label: 'AI Chat', icon: MessageSquareText },
        ].map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-semibold ${isActive ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}>
            <Icon className="h-4 w-4" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="hidden justify-between items-center gap-4 lg:flex">
        <div className="hidden w-full max-w-[540px] items-center rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-neutral-500" />
          <input
            className="ml-3 w-full bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400"
            placeholder="Search documents..."
            aria-label="Search all documents"
            type="search"
            value={query}
            onChange={event => searchDocuments(event.target.value)}
            onKeyDown={event => { if (event.key === 'Enter') searchDocuments(query) }}
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="hidden items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-700 shadow-sm sm:flex">
            <span className={`h-2.5 w-2.5 rounded-full ${apiStatus === 'connected' ? 'bg-neutral-500' : 'bg-neutral-400'}`} />
            {statusLabel}
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-700 shadow-sm sm:flex">
            <FileText className="h-4 w-4 text-neutral-700" />
            {documentsCount} docs
          </div>

        </div>
      </div>
    </header>
  )
}

export default Navbar
