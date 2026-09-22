import { useRef, useState } from 'react'
import { FileUp, UploadCloud } from 'lucide-react'

function FileUpload({ onUpload }) {
  const inputRef = useRef(null)
  const uploadingRef = useRef(false)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFiles = (files) => {
    if (uploadingRef.current) return

    const file = files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported in this workflow.')
      return
    }

    setError('')
    setIsUploading(true)
    uploadingRef.current = true
    setProgress(5)

    const uploadAfterProgress = async () => {
      try {
        await onUpload(file, (uploadProgress) => setProgress(Math.max(uploadProgress, 5)))
      } catch (uploadError) {
        const detail = uploadError?.response?.data?.detail
        setError(typeof detail === 'string' ? detail : 'Upload failed. Check that the backend is running.')
      } finally {
        setProgress(100)
        setTimeout(() => {
          setProgress(0)
          setIsUploading(false)
          uploadingRef.current = false
          if (inputRef.current) {
            inputRef.current.value = ''
          }
        }, 700)
      }
    }

    uploadAfterProgress()
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
      <button
        className="flex min-h-[190px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:bg-slate-50 disabled:cursor-not-allowed"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          handleFiles(event.dataTransfer.files)
        }}
        type="button"
        disabled={isUploading}
      >
        <span className="grid h-14 w-14 place-items-center rounded-full text-slate-950">
          <UploadCloud className="h-12 w-12 stroke-[2.2]" />
        </span>
        <span className="mt-4 text-lg font-extrabold text-slate-950">
          {isUploading ? 'Uploading PDF...' : 'Click to upload or drag a PDF'}
        </span>
        <span className="mt-2 text-base font-medium text-slate-500">
          PDF only. Ask questions after upload.
        </span>
        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-base font-extrabold text-white shadow-[0_8px_18px_rgba(15,23,42,0.18)]">
          <FileUp className="h-5 w-5" />
          Upload PDF
        </span>
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
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <FileUp className="h-3.5 w-3.5" />
              {progress >= 100 ? 'Processing' : 'Uploading'}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-blue-50">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
    </section>
  )
}

export default FileUpload
