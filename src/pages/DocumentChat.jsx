import { FileJson, ListChecks, RefreshCw } from 'lucide-react'
import ChatWindow from '../components/ChatWindow'
import FileUpload from '../components/FileUpload'
import PDFViewer from '../components/PDFViewer'

function DocumentChat({ document, onUpload }) {
  if (!document) {
    return (
      <div className="flex-1 p-4 md:p-5">
        <FileUpload onUpload={onUpload} />
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-5">
      <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          <PDFViewer document={document} />
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          <ChatWindow document={document} />
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-neutral-950">
              <ListChecks className="h-5 w-5 text-neutral-950" />
              Summary
            </h2>
            <button className="rounded-xl border border-neutral-200 p-2 text-neutral-600" title="Regenerate summary" type="button">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-neutral-600">{document.summary}</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {document.keyPoints.map((point) => (
              <li className="rounded-xl bg-neutral-100 p-3" key={point}>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <h2 className="flex items-center gap-2 font-semibold text-neutral-950">
            <FileJson className="h-5 w-5 text-neutral-950" />
            Document details
          </h2>
          <div className="mt-3 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
            {Object.entries(document.fields).map(([key, value]) => (
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
