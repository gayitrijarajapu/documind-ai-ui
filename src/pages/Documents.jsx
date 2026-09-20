import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import DocumentList from '../components/DocumentList'

function Documents({ documents, activeDocumentId, onOpenDocument, onDeleteDocument }) {
  const [query, setQuery] = useState('')
  const filteredDocuments = useMemo(
    () =>
      documents.filter((document) =>
        `${document.title} ${document.fileName} ${document.status}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [documents, query],
  )

  return (
    <div className="flex-1 p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Knowledge base
          </p>
          <h2 className="text-xl font-semibold text-neutral-950">My Documents</h2>
        </div>
        <label className="flex min-w-0 items-center rounded-xl border border-neutral-200 bg-white px-3 py-2 md:w-72">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search PDFs"
            value={query}
          />
        </label>
      </div>
      <DocumentList
        documents={filteredDocuments}
        activeDocumentId={activeDocumentId}
        onDeleteDocument={onDeleteDocument}
        onOpenDocument={onOpenDocument}
      />
    </div>
  )
}

export default Documents
