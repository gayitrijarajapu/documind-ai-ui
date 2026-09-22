import { Eye, FileText, MoreHorizontal, Trash2 } from 'lucide-react'

function StatusBadge({ status }) {
  const styles = {
    Indexed: 'border-emerald-100 bg-emerald-100 text-emerald-700',
    Processing: 'border-amber-100 bg-amber-100 text-amber-700',
    'Needs review': 'border-amber-100 bg-amber-100 text-amber-700',
  }

  return (
    <span
      className={`inline-flex w-fit items-center rounded-xl border px-3 py-1 text-xs font-extrabold ${
        styles[status] ?? 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}

function DocumentList({ documents, activeDocumentId, loading, onOpenDocument, onDeleteDocument }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
        Loading documents...
      </div>
    )
  }

  if (!documents.length) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-500">
        No documents yet. Upload a PDF to begin.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <div className="hidden grid-cols-[1.5fr_0.7fr_0.75fr_0.5fr_0.55fr] border-b border-slate-200 bg-white px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-400 md:grid">
        <span>File name</span>
        <span>Status</span>
        <span>Added</span>
        <span>Size</span>
        <span className="text-right">Actions</span>
      </div>
      {documents.map((document) => (
        <article
          className={`grid gap-3 border-b border-slate-100 p-3 last:border-b-0 md:grid-cols-[1.5fr_0.7fr_0.75fr_0.5fr_0.55fr] md:items-center ${
            document.id === activeDocumentId ? 'bg-slate-50' : 'bg-white'
          }`}
          key={document.id}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-extrabold text-slate-950">{document.title}</h3>
              <p className="truncate text-sm font-medium text-slate-500">{document.fileName}</p>
            </div>
          </div>
          <StatusBadge status={document.status} />
          <p className="text-sm font-medium text-slate-500">{document.uploadedAt}</p>
          <p className="text-sm font-medium text-slate-500">{document.size}</p>
          <div className="flex justify-end gap-1">
            <button
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              onClick={() => onOpenDocument(document.id)}
              title="Open document"
              type="button"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              onClick={() => {
                if (window.confirm(`Delete ${document.fileName}?`)) {
                  onDeleteDocument?.(document.id)
                }
              }}
              title="Delete document"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              title="More actions"
              type="button"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default DocumentList
