import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  FileJson,
  FileText,
  Info,
  ListChecks,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ChatWindow from '../components/ChatWindow'
import FileUpload from '../components/FileUpload'
import PDFViewer from '../components/PDFViewer'
import { extractDocumentFields, getApiErrorMessage, summarizeDocument } from '../services/api'

function DocumentChat({ document, onDocumentUpdated, onUpload }) {
  const [details, setDetails] = useState(document)
  const [extractLoading, setExtractLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [activePanel, setActivePanel] = useState('Preview')
  const [mobilePanel, setMobilePanel] = useState('chat')
  const [error, setError] = useState('')

  useEffect(() => {
    setDetails(document)
    setError('')
    setActivePanel('Preview')
    setMobilePanel('chat')
  }, [document])

  if (!document || !details) {
    return (
      <div className="flex-1 bg-white p-8">
        <FileUpload onUpload={onUpload} />
      </div>
    )
  }

  const isIndexed = details?.status === 'Indexed'
  const statusMessage =
    details?.status === 'Needs review'
      ? details.summary || 'Processing failed. Review the backend message and upload again if needed.'
      : 'Summary, extraction, and chat are available after indexing finishes.'

  const generateSummary = async () => {
    if (!isIndexed) return
    setError('')
    setSummaryLoading(true)
    setActivePanel('Summary')
    try {
      const result = await summarizeDocument(document.id)
      setDetails((current) => ({
        ...current,
        summary: result.summary,
        keyPoints: result.keyPoints ?? result.key_points ?? [],
      }))
      await onDocumentUpdated?.()
    } catch (summaryError) {
      setError(getApiErrorMessage(summaryError, 'Could not generate a summary for this document.'))
    } finally {
      setSummaryLoading(false)
    }
  }

  const extractDetails = async () => {
    if (!isIndexed) return
    setError('')
    setExtractLoading(true)
    setActivePanel('Extracted Info')
    try {
      const result = await extractDocumentFields(document.id)
      setDetails((current) => ({ ...current, fields: result.fields ?? {} }))
      await onDocumentUpdated?.()
    } catch (extractError) {
      setError(getApiErrorMessage(extractError, 'Could not find document details right now.'))
    } finally {
      setExtractLoading(false)
    }
  }

  return (
    <div className="document-chat-page flex min-h-0 flex-1 flex-col bg-white px-3 py-2">
      {error && (
        <div className="mb-4 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700">
          {error}
        </div>
      )}
      {!isIndexed && (
        <div className="mb-4 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700">
          {statusMessage}
        </div>
      )}

      <div className="mb-2 flex shrink-0 gap-2 lg:hidden" aria-label="Document workspace">
        {['chat', 'document'].map(panel => <button key={panel} type="button" aria-pressed={mobilePanel === panel} onClick={() => setMobilePanel(panel)} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${mobilePanel === panel ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-black'}`}>{panel === 'chat' ? 'AI Chat' : 'View document'}</button>)}
      </div>
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <main className={`${mobilePanel === 'document' ? 'block' : 'hidden'} min-h-0 min-w-0 overflow-y-auto lg:block lg:pr-1`}>
          <Link
            className="inline-flex items-center gap-2 text-base font-bold text-neutral-500 hover:text-neutral-950"
            to="/documents"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to documents
          </Link>

          <section className="mt-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-extrabold tracking-tight text-neutral-950">
                  {details.fileName}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-bold text-neutral-500">
                  <MetaItem icon={FileText} label="PDF" />
                  <MetaItem icon={FileJson} label={details.size || '--'} />
                  <MetaItem icon={Info} label={`${details.pages || 1} page${details.pages === 1 ? '' : 's'}`} />
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
                      isIndexed ? 'bg-neutral-50 text-neutral-600' : 'bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-current" />
                    {details.status}
                  </span>
                  <MetaItem icon={Calendar} label={`Added ${details.uploadedAt || 'today'}`} />
                </div>
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                <button className="rounded-xl border border-neutral-200 bg-white p-3 text-neutral-500 shadow-sm" type="button">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <TabButton active={activePanel === 'Preview'} label="Preview" onClick={() => setActivePanel('Preview')} />
              <TabButton
                active={activePanel === 'Summary'}
                disabled={!isIndexed || summaryLoading}
                icon={summaryLoading ? RefreshCw : ListChecks}
                label={summaryLoading ? 'Summarizing' : 'Summary'}
                onClick={generateSummary}
              />
              <TabButton active={activePanel === 'Key Points'} label="Key Points" onClick={() => setActivePanel('Key Points')} />
              <TabButton
                active={activePanel === 'Extracted Info'}
                disabled={!isIndexed || extractLoading}
                icon={extractLoading ? RefreshCw : FileJson}
                label={extractLoading ? 'Finding' : 'Extracted Info'}
                onClick={extractDetails}
              />
              <TabButton active={activePanel === 'Metadata'} label="Metadata" onClick={() => setActivePanel('Metadata')} />
            </div>
          </section>

          <section className="mt-4">
            {activePanel === 'Preview' && <PDFViewer document={details} />}
            {activePanel === 'Summary' && <SummaryPanel details={details} loading={summaryLoading} />}
            {activePanel === 'Key Points' && <KeyPointsPanel details={details} />}
            {activePanel === 'Extracted Info' && <ExtractedInfoPanel details={details} loading={extractLoading} />}
            {activePanel === 'Metadata' && <MetadataPanel details={details} />}
          </section>
        </main>

        <aside className={`${mobilePanel === 'chat' ? 'block' : 'hidden'} min-h-0 min-w-0 lg:block`}>
          <ChatWindow document={details} disabled={!isIndexed} />
        </aside>
      </div>
    </div>
  )
}

function MetaItem({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="h-4 w-4" />
      {label}
    </span>
  )
}

function TabButton({ active, disabled, icon: Icon, label, onClick }) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active ? 'bg-black text-white' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {Icon && <Icon className={`h-4 w-4 ${label.endsWith('ing') ? 'animate-spin' : ''}`} />}
      {label}
    </button>
  )
}

function SummaryPanel({ details, loading }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
      <h3 className="text-xl font-extrabold text-neutral-950">Summary</h3>
      <p className="mt-4 text-base font-medium leading-8 text-neutral-600">
        {loading ? 'Generating summary...' : details.summary || 'No summary is available yet.'}
      </p>
    </section>
  )
}

function KeyPointsPanel({ details }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
      <h3 className="text-xl font-extrabold text-neutral-950">Key Points</h3>
      <div className="mt-4 space-y-3">
        {(details.keyPoints ?? []).length ? (
          details.keyPoints.map((point) => (
            <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700" key={point}>
              {point}
            </p>
          ))
        ) : (
          <p className="text-sm font-medium text-neutral-500">Key points will appear after generating a summary.</p>
        )}
      </div>
    </section>
  )
}

function ExtractedInfoPanel({ details, loading }) {
  const entries = Object.entries(details.fields ?? {})
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
      <h3 className="text-xl font-extrabold text-neutral-950">Extracted Info</h3>
      <div className="mt-4 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
        {loading ? (
          <p className="px-4 py-3 text-sm font-medium text-neutral-500">Finding important information...</p>
        ) : entries.length ? (
          entries.map(([key, value]) => (
            <div className="grid gap-3 px-4 py-3 text-sm md:grid-cols-[0.7fr_1fr]" key={key}>
              <span className="font-bold text-neutral-500">{key}</span>
              <span className="font-semibold text-neutral-950">{value}</span>
            </div>
          ))
        ) : (
          <p className="px-4 py-3 text-sm font-medium text-neutral-500">Extracted details will appear here.</p>
        )}
      </div>
    </section>
  )
}

function MetadataPanel({ details }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
      <h3 className="text-xl font-extrabold text-neutral-950">Metadata</h3>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        {[
          ['File name', details.fileName],
          ['Status', details.status],
          ['Pages', details.pages || 1],
          ['Size', details.size || '--'],
          ['Added', details.uploadedAt || '--'],
          ['Category', details.category || 'PDF'],
        ].map(([label, value]) => (
          <div className="rounded-xl bg-neutral-50 p-4" key={label}>
            <p className="font-bold text-neutral-500">{label}</p>
            <p className="mt-1 font-extrabold text-neutral-950">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DocumentChat
