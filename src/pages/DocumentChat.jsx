import { useEffect, useState } from 'react'
import { FileJson, ListChecks, RefreshCw } from 'lucide-react'
import ChatWindow from '../components/ChatWindow'
import FileUpload from '../components/FileUpload'
import PDFViewer from '../components/PDFViewer'
import { extractDocumentFields, summarizeDocument } from '../services/api'

function DocumentChat({ document, onDocumentUpdated, onUpload }) {
  const [details, setDetails] = useState(document)
  const [extractLoading, setExtractLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setDetails(document)
    setError('')
  }, [document])

  if (!document) {
    return (
      <div className="flex-1 p-4 md:p-5">
        <FileUpload onUpload={onUpload} />
      </div>
    )
  }

  const generateSummary = async () => {
    setError('')
    setSummaryLoading(true)
    try {
      const result = await summarizeDocument(document.id)
      setDetails((current) => ({
        ...current,
        summary: result.summary,
        keyPoints: result.keyPoints ?? result.key_points ?? [],
      }))
      await onDocumentUpdated?.()
    } catch {
      setError('Could not generate a summary for this document.')
    } finally {
      setSummaryLoading(false)
    }
  }

  const extractDetails = async () => {
    setError('')
    setExtractLoading(true)
    try {
      const result = await extractDocumentFields(document.id)
      setDetails((current) => ({ ...current, fields: result.fields ?? {} }))
      await onDocumentUpdated?.()
    } catch {
      setError('Could not find document details right now.')
    } finally {
      setExtractLoading(false)
    }
  }

  return (
    <div className="flex-1 p-4 md:p-5">
      {error && (
        <div className="mb-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-950">
          {error}
        </div>
      )}
      <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          <PDFViewer document={details} />
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          <ChatWindow document={details} />
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-neutral-950">
              <ListChecks className="h-5 w-5 text-neutral-950" />
              Summary
            </h2>
            <button
              className="rounded-xl border border-neutral-200 p-2 text-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={summaryLoading}
              onClick={generateSummary}
              title="Generate summary"
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {summaryLoading ? 'Generating summary...' : details.summary}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {(details.keyPoints ?? []).map((point) => (
              <li className="rounded-xl bg-neutral-100 p-3" key={point}>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-neutral-950">
              <FileJson className="h-5 w-5 text-neutral-950" />
              Document details
            </h2>
            <button
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={extractLoading}
              onClick={extractDetails}
              type="button"
            >
              {extractLoading ? 'Finding...' : 'Find details'}
            </button>
          </div>
          <div className="mt-3 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
            {Object.entries(details.fields ?? {}).map(([key, value]) => (
              <div className="grid grid-cols-[0.7fr_1fr] gap-3 px-4 py-3 text-sm" key={key}>
                <span className="font-medium text-neutral-500">{key}</span>
                <span className="text-neutral-950">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default DocumentChat
