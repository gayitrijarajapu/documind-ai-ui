import { ChevronDown, FileSearch } from 'lucide-react'

function SourceReference({ source }) {
  return (
    <details className="group min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-700">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 [&::-webkit-details-marker]:hidden">
        <FileSearch className="h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0 flex-1 break-words font-medium">
          {source.label}{source.page != null && ` · Page ${source.page}`}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="max-h-48 space-y-3 overflow-y-auto border-t border-neutral-200 px-3 py-2">
        <p className="font-medium text-neutral-500">Source excerpts</p>
        {source.excerpts.length ? source.excerpts.map((text, index) => (
          <blockquote key={index} className="whitespace-pre-wrap break-words border-l-2 border-neutral-300 pl-2 leading-5">{text}</blockquote>
        )) : <p>No preview available for this source.</p>}
      </div>
    </details>
  )
}

export default SourceReference
