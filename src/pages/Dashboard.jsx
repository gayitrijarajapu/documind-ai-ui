import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import DocumentList from '../components/DocumentList'
import FileUpload from '../components/FileUpload'

function Dashboard({ documents, activeDocument, loading, onUpload, onOpenDocument, stats }) {
  const indexedCount = stats?.indexed ?? documents.filter((document) => document.status === 'Indexed').length
  const processingCount =
    stats?.processing ?? documents.filter((document) => document.status === 'Processing').length
  const documentCount = stats?.documents ?? documents.length
  const answerCount = stats?.aiAnswers ?? 0

  return (
    <div className="flex-1 bg-white p-4 md:p-5">
      <div className="w-full">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-950">
              <span className="h-2 w-2 rounded-full bg-black" />
              Documents: {documentCount}
            </div>
            <p className="text-sm font-semibold text-neutral-500">DocuMind workspace</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
              Manage your document knowledge base
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Upload PDFs, review processing status, open a document, then ask questions with
              answers, summaries, and page references.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-black px-3.5 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            to="/chat"
          >
            Open AI chat
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          <MetricsPanel
            documentCount={documentCount}
            indexedCount={indexedCount}
            loading={loading}
            processingCount={processingCount}
            answerCount={answerCount}
          />
          <FileUpload onUpload={onUpload} />
        </div>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-950">Recent documents</h2>
            <Link className="text-sm font-semibold text-neutral-500 hover:text-neutral-950" to="/documents">
              View all
            </Link>
          </div>
          <DocumentList
            documents={documents.slice(0, 3)}
            activeDocumentId={activeDocument?.id}
            loading={loading}
            onOpenDocument={onOpenDocument}
          />
        </div>
        <aside className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-neutral-950" />
            <h2 className="font-semibold text-neutral-950">Active document</h2>
          </div>
          {activeDocument ? (
            <>
              <h3 className="mt-3 text-lg font-semibold text-neutral-950">
                {activeDocument.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{activeDocument.summary}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-neutral-100 p-3">
                  <p className="text-neutral-400">Pages</p>
                  <p className="font-semibold text-neutral-950">{activeDocument.pages}</p>
                </div>
                <div className="rounded-2xl bg-neutral-100 p-3">
                  <p className="text-neutral-400">Status</p>
                  <p className="font-semibold text-neutral-950">{activeDocument.status}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-2xl bg-neutral-100 p-4 text-sm leading-6 text-neutral-600">
              Upload a PDF to select an active document for chat, summary, and page references.
            </div>
          )}
        </aside>
      </section>
      </div>
    </div>
  )
}

function MetricsPanel({ answerCount, documentCount, indexedCount, loading, processingCount }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="grid md:grid-cols-4">
        {[
          ['Number of documents', documentCount],
          ['Indexed documents', indexedCount],
          ['Processing', processingCount],
          ['AI answers', answerCount],
        ].map(([label, value], index) => (
          <div
            className={`p-4 ${index === 0 ? 'border-b-2 border-black' : 'border-l border-neutral-100'}`}
            key={label}
          >
            <p className="text-sm font-semibold text-neutral-500">{label}</p>
            <p className="mt-2 text-xl font-semibold text-neutral-950">
              {loading ? '...' : value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dashboard
