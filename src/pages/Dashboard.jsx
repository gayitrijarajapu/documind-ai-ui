import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  HelpCircle,
  MessageSquareText,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import DocumentList from '../components/DocumentList'
import FileUpload from '../components/FileUpload'

const metricCards = [
  {
    label: 'Number of documents',
    key: 'documents',
    icon: FileText,
    theme: 'border-blue-200 bg-blue-50/70 text-blue-600',
    wave: 'bg-blue-200/50',
  },
  {
    label: 'Indexed documents',
    key: 'indexed',
    icon: CheckCircle2,
    theme: 'border-emerald-200 bg-emerald-50/80 text-emerald-600',
    wave: 'bg-emerald-200/50',
  },
  {
    label: 'Processing',
    key: 'processing',
    icon: Clock3,
    theme: 'border-amber-200 bg-amber-50/70 text-amber-500',
    wave: 'bg-amber-200/50',
  },
  {
    label: 'AI answers',
    key: 'answers',
    icon: MessageSquareText,
    theme: 'border-purple-200 bg-purple-50/80 text-purple-600',
    wave: 'bg-purple-200/50',
  },
]

function Dashboard({ documents, activeDocument, loading, onUpload, onOpenDocument, stats }) {
  const indexedCount = stats?.indexed ?? documents.filter((document) => document.status === 'Indexed').length
  const processingCount =
    stats?.processing ?? documents.filter((document) => document.status === 'Processing').length
  const documentCount = stats?.documents ?? documents.length
  const answerCount = stats?.aiAnswers ?? 0
  const metricValues = {
    documents: documentCount,
    indexed: indexedCount,
    processing: processingCount,
    answers: answerCount,
  }

  return (
    <div className="flex-1 bg-white px-8 py-6">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-base font-bold text-slate-500">DocuMind workspace</p>
          <h2 className="mt-1 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950">
            Manage your document knowledge base
          </h2>
          <p className="mt-2 max-w-3xl text-base font-medium leading-7 text-slate-500">
            Upload PDFs, review processing status, open a document, then ask questions with answers,
            summaries, and page references.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center gap-3 rounded-xl bg-slate-950 px-7 py-4 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] hover:bg-slate-800"
          to="/chat"
        >
          Open AI chat
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {metricCards.map(({ icon: Icon, key, label, theme, wave }) => (
              <article className={`relative overflow-hidden rounded-2xl border p-4 ${theme}`} key={key}>
                <div className={`absolute -bottom-10 right-0 h-24 w-44 rounded-[100%] blur-xl ${wave}`} />
                <div className="relative">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/70 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-3xl font-extrabold text-slate-950">
                    {loading ? '...' : metricValues[key]}
                  </p>
                  <p className="mt-1 text-base font-bold">{label}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_0.92fr]">
            <FileUpload onUpload={onUpload} />
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-8 shadow-[0_10px_28px_rgba(37,99,235,0.08)]">
              <div className="flex items-center justify-center">
                <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-blue-600">
                  <FileText className="h-10 w-10" />
                  <Sparkles className="absolute -right-2 -top-2 h-8 w-8 fill-purple-500 text-purple-500" />
                </span>
              </div>
              <h3 className="mt-5 text-center text-xl font-extrabold text-slate-950">
                Turn your documents into answers
              </h3>
              <ul className="mx-auto mt-4 max-w-sm space-y-3 text-base font-bold text-slate-700">
                {[
                  'Get instant summaries',
                  'Ask questions with page references',
                  'Extract important information',
                  'Works with your PDF documents',
                ].map((item) => (
                  <li className="flex items-center gap-3" key={item}>
                    <Check className="h-5 w-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-950">Recent documents</h2>
              <Link
                className="inline-flex items-center gap-2 text-base font-extrabold text-blue-600 hover:text-blue-700"
                to="/documents"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <DocumentList
              documents={documents.slice(0, 5)}
              activeDocumentId={activeDocument?.id}
              loading={loading}
              onOpenDocument={onOpenDocument}
            />
          </section>
        </div>

        <RightRail />
      </div>
    </div>
  )
}

function RightRail() {
  return (
    <aside className="space-y-4">
      <Panel title="Quick actions">
        <ActionItem icon={UploadCloud} label="Upload PDF" sublabel="Add a new document" theme="blue" />
        <ActionItem icon={MessageSquareText} label="Open AI Chat" sublabel="Ask questions with your documents" theme="purple" />
        <ActionItem icon={FileText} label="View Documents" sublabel="Manage and explore all files" theme="emerald" />
        <ActionItem icon={HelpCircle} label="Get Help" sublabel="Learn how it works" theme="violet" />
      </Panel>

      <Panel title="Tips" action="View all">
        <TipItem icon={MessageSquareText} label="Use specific questions" text="Ask clear and specific questions to get more accurate answers." />
        <TipItem icon={FileText} label="Check source pages" text="AI answers include page references. Always verify important information." />
        <TipItem icon={Sparkles} label="Try a summary" text="Generate a quick summary to get an overview of your document." />
      </Panel>
    </aside>
  )
}

function Panel({ action, children, title }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
        {action && <button className="text-sm font-extrabold text-blue-600" type="button">{action}</button>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function ActionItem({ icon: Icon, label, sublabel, theme }) {
  const themes = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
  }

  return (
    <Link
      className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-blue-100 hover:bg-slate-50"
      to={label === 'Open AI Chat' ? '/chat' : label === 'View Documents' ? '/documents' : '/'}
    >
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${themes[theme]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-slate-950">{label}</span>
        <span className="block truncate text-sm font-medium text-slate-500">{sublabel}</span>
      </span>
      <ArrowRight className="h-4 w-4 text-slate-500" />
    </Link>
  )
}

function TipItem({ icon: Icon, label, text }) {
  return (
    <div className="flex gap-4 rounded-xl bg-blue-50/60 p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-extrabold text-slate-950">{label}</p>
        <p className="text-sm font-medium leading-5 text-slate-500">{text}</p>
      </div>
    </div>
  )
}

export default Dashboard
