import { FileSearch } from 'lucide-react'

function SourceReference({ source }) {
  return (
    <div className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-700">
      <div className="flex items-center gap-1 font-semibold text-neutral-950">
        <FileSearch className="h-3.5 w-3.5" />
        Page {source.page} · {source.label}
      </div>
      {source.text && <p className="mt-1 max-w-md leading-5 text-neutral-500">{source.text}</p>}
    </div>
  )
}

export default SourceReference
