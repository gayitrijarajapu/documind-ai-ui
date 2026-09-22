import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, CheckCircle2, Clock3, Database, FileText, MessageSquareText, NotepadText } from 'lucide-react'
import DocumentList from '../components/DocumentList'
import FileUpload from '../components/FileUpload'

function Dashboard({ documents, activeDocument, loading, onUpload, onOpenDocument, onDeleteDocument, stats }) {
  const metrics = [
    { label: 'Documents', value: stats?.documents ?? documents.length, icon: FileText },
    { label: 'Indexed', value: stats?.indexed ?? documents.filter(document => document.status === 'Indexed').length, icon: CheckCircle2 },
    { label: 'Needs review', value: documents.filter(document => document.status === 'Needs review').length, icon: Clock3 },
  ]
  return (
    <div className="dashboard-page flex-1 bg-white px-3 lg:px-5 py-3">
      <div className="mb-3">
        <p className="text-sm font-semibold text-neutral-500">DocuMind workspace</p>
        <h2 className="mt-1 text-base font-bold tracking-tight text-black xl:text-2xl">Upload PDFs, find answers, and manage your documents.</h2>
      </div>
      <section className="mb-3 grid gap-3 md:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article key={label} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
            <span className="hidden lg:grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neutral-100 text-black"><Icon className="h-6 w-6" /></span>
            <div><p className="font-semibold text-neutral-600">{label}</p><p className="mt-1 text-2xl font-bold text-black">{loading ? '…' : value}</p></div>
          </article>
        ))}
      </section>
      <section className="mb-3 grid gap-3 lg:grid-cols-[1.12fr_1fr]">
        <FileUpload onUpload={onUpload} />
        <div className="hidden lg:block rounded-2xl border border-neutral-200 bg-white p-4">
          <h3 className="text-base font-bold text-black">Get started</h3>
          <p className="mt-2 text-neutral-500">Turn your documents into useful information.</p>
          <div className="mt-3 divide-y divide-neutral-100">
            {[
              { label: 'Ask a question', description: 'Get instant answers from your documents', icon: MessageSquareText },
              { label: 'Summarize a document', description: 'Generate a concise summary', icon: NotepadText },
              { label: 'Extract information', description: 'Pull key details like names, dates, and more', icon: Database },
            ].map(({ label, description, icon: Icon }) => (
              <Link key={label} to="/chat" className="flex items-center gap-3 rounded-lg py-3 hover:bg-neutral-50">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-black"><Icon className="h-6 w-6" /></span>
                <span className="min-w-0 flex-1"><span className="block font-semibold text-black">{label}</span><span className="mt-1 block text-sm text-neutral-500">{description}</span></span>
                <ChevronRight className="h-5 w-5 shrink-0 text-neutral-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-base font-bold text-black">Recent documents</h2>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:underline" to="/documents">View all<ArrowRight className="h-4 w-4" /></Link>
        </div>
        <DocumentList documents={documents.slice(0, 5)} activeDocumentId={activeDocument?.id} loading={loading} onOpenDocument={onOpenDocument} onDeleteDocument={onDeleteDocument} compact />
      </section>
    </div>
  )
}
export default Dashboard
