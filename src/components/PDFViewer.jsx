import { Maximize2, Minus, MousePointer2, Plus, Search } from 'lucide-react'

function PDFViewer({ document }) {
  return (
    <section className="flex min-h-[520px] flex-col bg-white">
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Preview</p>
          <h2 className="font-semibold text-neutral-950">{document.fileName}</h2>
        </div>
        <button className="rounded-xl border border-neutral-200 p-2 text-neutral-600" title="Fullscreen" type="button">
          <Maximize2 className="h-4 w-4" />
        </button>
      </header>
      <div className="flex flex-1 items-center justify-center bg-neutral-50 p-4">
        <div className="aspect-[0.72] w-full max-w-sm overflow-hidden rounded-sm bg-white p-6 shadow-xl">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {document.category}
          </p>
          <h3 className="mt-3 text-center text-lg font-bold text-neutral-950">{document.title}</h3>
          <div className="mt-5 h-px bg-neutral-300" />
          <p className="mt-6 text-sm font-semibold text-neutral-800">Abstract</p>
          <p className="mt-3 text-sm leading-6 text-neutral-600">{document.summary}</p>
          <p className="mt-6 text-sm font-semibold text-neutral-800">Key points</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
            {document.keyPoints.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-950">
            Answers can point back to the pages they came from.
          </div>
        </div>
      </div>
      <footer className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
        <div className="flex gap-2">
          {[Minus, Plus, Search, MousePointer2].map((Icon, index) => (
            <button
              className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
              key={index}
              title="PDF control"
              type="button"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <p className="text-sm font-semibold text-neutral-900">Page 1 of {document.pages}</p>
      </footer>
    </section>
  )
}

export default PDFViewer
