import { useRef, useState } from 'react'
import { FileUp, UploadCloud } from 'lucide-react'

function FileUpload({ onUpload }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const handleFiles = (files) => {
    const file = files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported in this workflow.')
      return
    }

    setError('')
    setProgress(18)
    const timer = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(timer)
          Promise.resolve(onUpload(file))
            .catch(() => setError('Upload failed. Check that the backend is running.'))
            .finally(() => setTimeout(() => setProgress(0), 700))
          return 100
        }
        return current + 22
      })
    }, 220)
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4">
      <button
        className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-6 text-center hover:bg-neutral-50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          handleFiles(event.dataTransfer.files)
        }}
        type="button"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white">
          <UploadCloud className="h-5 w-5" />
        </span>
        <span className="mt-3 font-semibold text-neutral-950">Click to upload or drag a PDF</span>
        <span className="mt-1 text-sm text-neutral-500">PDF only. Ask questions after upload.</span>
      </button>
      <input
        accept="application/pdf"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
        ref={inputRef}
        type="file"
      />
      {progress > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
            <span className="flex items-center gap-1">
              <FileUp className="h-3.5 w-3.5" />
              Processing
            </span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-neutral-100">
            <div className="h-2 rounded-full bg-neutral-950" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-sm font-medium text-neutral-950">{error}</p>}
    </section>
  )
}

export default FileUpload
