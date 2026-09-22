import { useSearchParams } from 'react-router-dom'
import DocumentList from '../components/DocumentList'
import { useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Edit3,
  Expand,
  Eye,
  FileText,
  Filter,
  Maximize2,
  MoreHorizontal,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react'

const filters = ['All', 'Indexed', 'Processing', 'Needs review']

function Documents({
  activeDocument,
  activeDocumentId,
  documents,
  loading,
  onDeleteDocument,
  onOpenDocument,
  onUpload,
}) {
  const inputRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const setQuery = value => {
    setSearchParams(current => {
      const next = new URLSearchParams(current)
      if (value) next.set('q', value)
      else next.delete('q')
      return next
    }, { replace: true })
  }
  const [filter, setFilter] = useState('All')
  const [uploading, setUploading] = useState(false)
  const uploadBusy = useRef(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [uploadError, setUploadError] = useState('')

  const counts = useMemo(
    () => ({
      All: documents.length,
      Indexed: documents.filter((document) => document.status === 'Indexed').length,
      Processing: documents.filter((document) => document.status === 'Processing').length,
      'Needs review': documents.filter((document) => document.status === 'Needs review').length,
    }),
    [documents],
  )

  const filteredDocuments = useMemo(
    () =>
      documents.filter((document) => {
        const matchesQuery = `${document.title} ${document.fileName} ${document.status}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
        const matchesFilter = filter === 'All' || document.status === filter
        return matchesQuery && matchesFilter
      }),
    [documents, filter, query],
  )

  const selectedDocument =
    documents.find((document) => document.id === activeDocumentId) ?? activeDocument ?? documents[0]

  const uploadFile = async (file) => {
    if (!file || uploadBusy.current) return
    if ((file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) || file.size > 50 * 1024 * 1024) {
      setUploadError('Choose a PDF no larger than 50 MB.')
      return
    }
    uploadBusy.current = true
    setUploadError('')
    setUploadProgress(null)
    setUploading(true)
    try {
      await onUpload(file, setUploadProgress)
    } catch {
      setUploadError('Upload could not be completed. Please try again.')
    } finally {
      uploadBusy.current = false
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex-1 bg-white px-3 py-3 lg:px-8 lg:py-6">
      <input
        accept="application/pdf"
        className="hidden"
        onChange={(event) => uploadFile(event.target.files?.[0])}
        ref={inputRef}
        type="file"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px] 2xl:grid-cols-[minmax(0,1fr)_390px]">
        <main className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-neutral-500">
                Knowledge Base
              </p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-950">
                My Documents
              </h2>
              <p className="mt-2 text-base font-medium text-neutral-500">
                View, manage, and explore all your uploaded documents.
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-black px-3 py-1.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] disabled:cursor-not-allowed disabled:bg-neutral-300"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              <UploadCloud className="h-5 w-5" />
              {uploading ? uploadProgress >= 100 ? 'Processing PDF…' : uploadProgress === null ? 'Uploading…' : `Uploading ${uploadProgress}%` : 'Upload PDF'}
            </button>
          </div>

          {uploadError && <p role="alert" className="mb-4 text-sm text-neutral-600">{uploadError}</p>}
          {uploading && <div role="status" className="mb-4 text-sm text-neutral-500">
            {uploadProgress >= 100 ? 'Upload received. Processing and indexing the document…' : 'Transferring your PDF…'}
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-50"><div className={`h-2 rounded-full bg-neutral-600 ${uploadProgress === null || uploadProgress >= 100 ? 'upload-indeterminate' : ''}`} style={uploadProgress !== null && uploadProgress < 100 ? { width: `${uploadProgress}%` } : undefined} /></div>
          </div>}
          <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  className={`rounded-full px-3 py-1.5 text-sm font-extrabold shadow-sm transition ${
                    filter === item
                      ? 'bg-black text-white'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item} ({counts[item]})
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <button
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-1.5 text-sm font-extrabold text-neutral-700 shadow-sm"
                type="button"
              >
                <Filter className="h-4 w-4" />
                Newest first
              </button>
              <label className="flex min-w-0 items-center rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm md:w-72">
                <Search className="h-4 w-4 text-neutral-400" />
                <input
                  className="ml-2 w-full bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400"
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search documents by name or status"
                  type="search"
                  placeholder="Search documents..."
                  value={query}
                />
              </label>
            </div>
          </div>

          <div className="lg:hidden"><DocumentList documents={filteredDocuments} activeDocumentId={selectedDocument?.id} loading={loading} onDeleteDocument={onDeleteDocument} onOpenDocument={onOpenDocument} compact /></div>
          <div className="hidden lg:block"><DocumentTable
            activeDocumentId={selectedDocument?.id}
            documents={filteredDocuments}
            loading={loading}
            onDeleteDocument={onDeleteDocument}
            onOpenDocument={onOpenDocument}
          /></div>
        </main>

        <div className="hidden lg:block"><DocumentPreviewPanel
          document={selectedDocument}
          onDeleteDocument={onDeleteDocument}
        /></div>
      </div>
    </div>
  )
}

function DocumentTable({ activeDocumentId, documents, loading, onDeleteDocument, onOpenDocument }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center font-semibold text-neutral-500">
        Loading documents...
      </div>
    )
  }

  if (!documents.length) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center font-semibold text-neutral-500">
        No documents found. Upload a PDF to begin.
      </div>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-[40px_1.65fr_0.7fr_0.75fr_0.5fr_0.7fr] items-center border-b border-neutral-200 px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-neutral-400">
        <input className="h-4 w-4 rounded border-neutral-300" type="checkbox" readOnly />
        <span>File name</span>
        <span>Status</span>
        <span>Added</span>
        <span>Size</span>
        <span className="text-right">Actions</span>
      </div>

      {documents.map((document) => {
        const selected = document.id === activeDocumentId
        return (
          <article
            className={`grid grid-cols-[40px_1.65fr_0.7fr_0.75fr_0.5fr_0.7fr] items-center border-b border-neutral-100 px-4 py-4 last:border-b-0 ${
              selected ? 'bg-neutral-50/70' : 'bg-white'
            }`}
            key={document.id}
          >
            <input
              checked={selected}
              className="h-4 w-4 rounded border-neutral-300 accent-neutral-600"
              onChange={() => onOpenDocument(document.id)}
              type="checkbox"
            />
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-base font-extrabold text-neutral-950">
                  {document.title}
                </h3>
                <p className="truncate text-sm font-medium text-neutral-500">{document.fileName}</p>
              </div>
            </div>
            <StatusBadge status={document.status} />
            <p className="text-sm font-semibold text-neutral-500">{document.uploadedAt || 'Today'}</p>
            <p className="text-sm font-semibold text-neutral-500">{document.size || '--'}</p>
            <div className="flex justify-end gap-4">
              <button className="text-neutral-700 hover:text-neutral-600" onClick={() => onOpenDocument(document.id)} title="Open document" type="button">
                <Eye className="h-5 w-5" />
              </button>
              <button
                className="text-neutral-700 hover:text-neutral-600"
                onClick={() => {
                  if (window.confirm(`Delete ${document.fileName}?`)) {
                    onDeleteDocument?.(document.id)
                  }
                }}
                title="Delete document"
                type="button"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button className="text-neutral-700 hover:text-neutral-950" title="More actions" type="button">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </article>
        )
      })}

      <footer className="flex items-center justify-between border-t border-neutral-100 px-4 py-5 text-sm font-semibold text-neutral-500">
        <span>Showing 1-{documents.length} of {documents.length} documents</span>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-3 text-neutral-300" type="button">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-sm font-extrabold text-white">
            1
          </span>
          <button className="rounded-full p-3 text-neutral-400 hover:bg-neutral-50" type="button">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </section>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Indexed: 'bg-neutral-100 text-neutral-700',
    Processing: 'bg-neutral-100 text-neutral-700',
    'Needs review': 'bg-neutral-100 text-neutral-700',
  }

  return (
    <span className={`inline-flex w-fit rounded-xl px-3 py-1 text-sm font-extrabold ${styles[status] ?? 'bg-neutral-100 text-neutral-700'}`}>
      {status}
    </span>
  )
}

function DocumentPreviewPanel({ document, onDeleteDocument }) {
  if (!document) {
    return (
      <aside className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm font-semibold text-neutral-500">
        Select a document to preview details.
      </aside>
    )
  }

  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-neutral-950">Document Preview</h3>
          <button className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50" type="button">
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
        <div className="rounded-xl bg-neutral-100 p-4">
          <div className="aspect-[0.72] bg-white px-8 py-7 shadow-sm">
            <p className="text-right text-[9px] font-semibold text-neutral-500">
              Document ID: {String(document.id).slice(0, 8)}
            </p>
            <h4 className="mt-10 text-center font-serif text-lg font-bold uppercase text-neutral-950">
              {document.category === 'Document' ? 'Document Preview' : document.category}
            </h4>
            <p className="mt-7 text-center font-serif text-sm font-bold text-neutral-800">
              {document.title}
            </p>
            <p className="mt-7 line-clamp-8 text-center font-serif text-xs leading-5 text-neutral-700">
              {document.summary ||
                'This PDF is ready for review. Ask questions, generate a summary, or extract important details.'}
            </p>
            <div className="mt-10 grid grid-cols-2 text-[10px] font-serif text-neutral-600">
              <p>Date: {document.uploadedAt || 'Today'}</p>
              <p className="text-right">DocuMind AI</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between px-2 text-sm font-extrabold text-neutral-700">
            <button className="rounded-lg p-2 hover:bg-white" type="button">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span>1 / {document.pages || 1}</span>
            <button className="rounded-lg p-2 hover:bg-white" type="button">
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="ml-4">-</span>
            <span>100%</span>
            <span>+</span>
            <Expand className="h-4 w-4" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-neutral-950">Document Details</h3>
          <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-bold text-neutral-600" type="button">
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
        </div>
        <div className="space-y-4">
          <DetailRow icon={FileText} label="File name" value={document.fileName} />
          <DetailRow icon={FileText} label="Size" value={document.size || '--'} />
          <DetailRow icon={FileText} label="Pages" value={document.pages || 1} />
          <DetailRow icon={Eye} label="Status" value={<StatusBadge status={document.status} />} />
          <DetailRow icon={FileText} label="Added" value={document.uploadedAt || 'Today'} />
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-3 py-1.5 text-sm font-extrabold text-white" type="button">
          Open in new tab
          <Expand className="h-4 w-4" />
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-1.5 text-sm font-extrabold text-neutral-700" type="button">
          <Download className="h-4 w-4" />
          Download
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-1.5 text-sm font-extrabold text-neutral-600"
          onClick={() => {
            if (window.confirm(`Delete ${document.fileName}?`)) {
              onDeleteDocument?.(document.id)
            }
          }}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </section>
    </aside>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="grid grid-cols-[24px_1fr_1fr] items-center gap-3 text-sm">
      <Icon className="h-4 w-4 text-neutral-600" />
      <span className="font-semibold text-neutral-500">{label}</span>
      <span className="min-w-0 truncate font-extrabold text-neutral-950">{value}</span>
    </div>
  )
}

export default Documents
