import { FileSearch } from 'lucide-react'

function SourceReference({ source }) {
  return (
    <button
      className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2 py-1 text-xs font-semibold text-neutral-950 hover:bg-neutral-100"
      type="button"
    >
      <FileSearch className="h-3.5 w-3.5" />
      p. {source.page} · {source.label}
    </button>
  )
}

export default SourceReference
