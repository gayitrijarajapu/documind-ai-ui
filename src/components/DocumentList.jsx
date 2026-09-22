import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../services/api'
import { Eye, FileText, MoreHorizontal, Trash2 } from 'lucide-react'

function StatusBadge({ status }) {
  const styles = {
    Indexed: 'border-neutral-100 bg-neutral-100 text-neutral-700',
    Processing: 'border-neutral-100 bg-neutral-100 text-neutral-700',
    'Needs review': 'border-neutral-100 bg-neutral-100 text-neutral-700',
  }

  return (
    <span
      className={`inline-flex w-fit items-center rounded-xl border px-3 py-1 text-xs font-extrabold ${
        styles[status] ?? 'border-neutral-200 bg-white text-neutral-600'
      }`}
    >
      {status}
    </span>
  )
}

function DocumentList({ documents, activeDocumentId, loading, onOpenDocument, onDeleteDocument, compact = false }) {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState(null)
  const [pendingId, setPendingId] = useState(null)
  const [error, setError] = useState('')
  const busy = useRef(false)

  const runAction = async (document, action) => {
    if (busy.current) return
    if (action === 'delete' && !window.confirm(`Delete ${document.fileName}? This cannot be undone.`)) return
    busy.current = true
    setPendingId(document.id)
    setError('')
    try {
      if (action === 'delete') {
        await onDeleteDocument(document.id)
      } else {
        await onOpenDocument(document.id)
        navigate('/chat')
      }
      setExpandedId(null)
    } catch (actionError) {
      setError(getApiErrorMessage(actionError, 'Could not complete this action. Please try again.'))
    } finally {
      busy.current = false
      setPendingId(null)
    }
  }

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
    <div className={compact ? "overflow-hidden bg-white" : "overflow-hidden rounded-2xl border border-neutral-200 bg-white"}>
      <div className="hidden grid-cols-[1.5fr_0.7fr_0.75fr_0.5fr_0.55fr] border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-neutral-400 md:grid">
        <span>File name</span>
        <span>Status</span>
        <span>Added</span>
        <span>Size</span>
        <span className="text-right">Actions</span>
      </div>
      {error && <p role="alert" className="border-b border-neutral-200 px-4 py-3 text-sm">{error}</p>}
      {documents.map((document) => (
        <article
          className={`grid gap-3 border-b border-neutral-100 px-3 py-1.5 last:border-b-0 md:grid-cols-[1.5fr_0.7fr_0.75fr_0.5fr_0.55fr] md:items-center ${
            document.id === activeDocumentId ? 'bg-neutral-50' : 'bg-white'
          }`}
          key={document.id}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-neutral-950">{compact ? document.fileName : document.title}</h3>
              {!compact && <p className="truncate text-sm font-medium text-neutral-500">{document.fileName}</p>}
            </div>
          </div>
          <StatusBadge status={document.status} />
          <p className="text-sm font-medium text-neutral-500">{document.uploadedAt}</p>
          <p className="text-sm font-medium text-neutral-500">{document.size}</p>
          <div className="flex justify-end gap-1">
            <button
              className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
              disabled={pendingId !== null}
              onClick={() => runAction(document, 'open')}
              title="Open document"
              type="button"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
              disabled={pendingId !== null || !onDeleteDocument}
              onClick={() => runAction(document, 'delete')}
              title="Delete document"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
              onClick={() => setExpandedId(current => current === document.id ? null : document.id)}
              aria-expanded={expandedId === document.id}
              aria-label={`More actions for ${document.fileName}`}
              disabled={pendingId !== null}
              title="More actions"
              type="button"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          {pendingId === document.id && <p role="status" className="text-xs text-neutral-500 md:col-span-5">Working…</p>}
          {expandedId === document.id && <div className="flex flex-wrap justify-end gap-2 border-t border-neutral-100 py-2 md:col-span-5" onKeyDown={event => { if (event.key === 'Escape') setExpandedId(null) }}>
            <button type="button" disabled={pendingId !== null} onClick={() => runAction(document, 'open')} className="rounded-lg bg-black px-3 py-1.5 text-xs text-white">Open AI Chat</button>
            <button type="button" disabled={pendingId !== null || !onDeleteDocument} onClick={() => runAction(document, 'delete')} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs">Delete document</button>
          </div>}
        </article>
      ))}
    </div>
  )
}

export default DocumentList
