import { Eye, FileText, MoreHorizontal, Trash2 } from 'lucide-react'

function StatusBadge({ status }) {
  const styles = {
    Indexed: 'bg-white text-neutral-950',
    Processing: 'bg-neutral-50 text-neutral-950',
    'Needs review': 'bg-neutral-100 text-neutral-950',
  }

  return (
    <span
      className={`inline-flex w-fit items-center rounded-xl border border-neutral-200 px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? 'bg-white text-neutral-600'
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
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="hidden grid-cols-[1.4fr_0.7fr_0.7fr_0.5fr_0.6fr] border-b border-neutral-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400 md:grid">
        <span>File name</span>
        <span>Status</span>
        <span>Added</span>
        <span>Size</span>
        <span className="text-right">Actions</span>
      </div>
      {documents.map((document) => (
        <article
          className={`grid gap-3 border-b border-neutral-100 p-3 last:border-b-0 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.5fr_0.6fr] md:items-center ${
            document.id === activeDocumentId ? 'bg-neutral-100' : 'bg-white'
          }`}
          key={document.id}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-neutral-950">{document.title}</h3>
              <p className="truncate text-sm text-neutral-500">{document.fileName}</p>
            </div>
          </div>
          <StatusBadge status={document.status} />
          <p className="text-sm text-neutral-500">{document.uploadedAt}</p>
          <p className="text-sm text-neutral-500">{document.size}</p>
          <div className="flex justify-end gap-1">
            <button
              className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
              onClick={() => onOpenDocument(document.id)}
              title="Open document"
              type="button"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
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
              className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
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
