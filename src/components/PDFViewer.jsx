import { ChevronLeft, ChevronRight, Download, Maximize2, Minus, Plus } from 'lucide-react'

function PDFViewer({ document }) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl bg-neutral-100">
      <header className="flex items-center justify-between flex-wrap gap-2 bg-neutral-800 px-3 py-2 text-white">
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-2 text-white/80 hover:bg-white/10" title="Previous page" type="button">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold">1</span>
          <span className="text-sm font-bold text-white/80">/ {document.pages || 1}</span>
          <button className="rounded-lg p-2 text-white/80 hover:bg-white/10" title="Next page" type="button">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-2 text-white/80 hover:bg-white/10" title="Zoom out" type="button">
            <Minus className="h-4 w-4" />
          </button>
          <span className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold">100%</span>
          <button className="rounded-lg p-2 text-white/80 hover:bg-white/10" title="Zoom in" type="button">
            <Plus className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-white/80 hover:bg-white/10" title="Fullscreen" type="button">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-2 text-white/80 hover:bg-white/10" title="Download" type="button">
            <Download className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-white/80 hover:bg-white/10" title="Expand" type="button">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </header>
      <div className="flex flex-1 items-start justify-center overflow-auto bg-neutral-100 px-4 py-4">
        <div className="w-full max-w-[480px] bg-white px-6 py-6 shadow-[0_16px_38px_rgba(0,0,0,0.18)]">
          <p className="text-right text-xs font-semibold text-neutral-500">
            Document ID: {String(document.id).slice(0, 8)}
          </p>
          <h3 className="mt-6 text-center text-lg font-serif font-bold uppercase text-neutral-950">
            {document.category === 'Document' ? 'Document Preview' : document.category}
          </h3>
          <p className="mt-5 text-center font-serif text-base text-neutral-800">
            {document.title}
          </p>
          <div className="mx-auto mt-4 h-px w-52 bg-neutral-300" />
          <p className="mt-5 text-center font-serif text-sm leading-6 text-neutral-800">
            {document.summary ||
              'This PDF is ready for review. Ask questions, generate a summary, or extract important details from the assistant panel.'}
          </p>
          {!!document.keyPoints?.length && (
            <ul className="mx-auto mt-5 max-w-md space-y-3 text-sm leading-6 text-neutral-700">
              {document.keyPoints.slice(0, 4).map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          )}
          <div className="mt-5 grid grid-cols-2 gap-10 text-sm font-serif text-neutral-700">
            <div>
              <p>Date: {document.uploadedAt || 'Today'}</p>
              <p>DocuMind AI</p>
            </div>
            <div className="text-right">
              <div className="ml-auto mb-2 h-px w-32 bg-neutral-500" />
              <p>Verified PDF</p>
              <p>Source grounded</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PDFViewer
