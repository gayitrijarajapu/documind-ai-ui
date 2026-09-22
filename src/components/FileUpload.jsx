import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileUp, MessageSquareText, UploadCloud } from 'lucide-react'

function FileUpload({ onUpload }) {
  const inputRef = useRef(null)
  const uploadingRef = useRef(false)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [stage, setStage] = useState('idle')

  const handleFiles = (files) => {
    if (uploadingRef.current) return

    const file = files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported in this workflow.')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('Maximum file size is 50 MB.')
      return
    }
    setError('')
    setStage('uploading')
    setIsUploading(true)
    uploadingRef.current = true
    setProgress(null)

    const uploadAfterProgress = async () => {
      try {
        const result = await onUpload(file, (value) => {
          setProgress(value)
          if (value >= 100) setStage('processing')
        })
        setStage(result?.status === 'Indexed' ? 'done' : result?.status === 'Needs review' ? 'review' : 'pending')
      } catch (uploadError) {
        setStage('error')
        const detail = uploadError?.response?.data?.detail
        setError(typeof detail === 'string' ? detail : 'Upload failed. Check that the backend is running.')
      } finally {
        setIsUploading(false)
        uploadingRef.current = false
        if (inputRef.current) inputRef.current.value = ''
      }
    }

    uploadAfterProgress()
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-black">Upload a PDF</h3>
        <Link to="/chat" className="inline-flex items-center gap-2 rounded-lg border border-black bg-black px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
          <MessageSquareText className="h-3.5 w-3.5" />
          AI Chat
        </Link>
      </div>
      <button
        className="upload-dropzone flex min-h-[170px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-4 text-center hover:bg-neutral-50 disabled:cursor-not-allowed"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          handleFiles(event.dataTransfer.files)
        }}
        type="button"
        disabled={isUploading}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full text-neutral-950">
          <UploadCloud className="h-9 w-9 stroke-[2.2]" />
        </span>
        <span className="mt-2 text-sm font-extrabold text-neutral-950">
          {isUploading ? stage === 'processing' ? 'Processing PDF...' : 'Uploading PDF...' : 'Click to upload or drag and drop a PDF'}
        </span>
        <span className="mt-2 text-sm font-medium text-neutral-500">
          PDF only. Maximum file size: 50 MB.
        </span>
        <span className="mt-3 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
          <FileUp className="h-4 w-4" />
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
      {stage !== 'idle' && stage !== 'error' && (
        <div className="mt-4" role="status" aria-live="polite">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
            <span>{stage === 'uploading' ? 'Uploading PDF' : stage === 'processing' ? 'Upload received · processing document…' : stage === 'done' ? 'Indexed · ready to chat' : stage === 'review' ? 'Document needs review' : 'Uploaded · indexing continues in the background'}</span>
            {stage === 'uploading' && progress !== null && <span>{progress}%</span>}
          </div>
          {isUploading && <div role="progressbar" aria-label={stage === 'processing' ? 'Processing document' : 'Uploading PDF'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={stage === 'uploading' && progress !== null ? progress : undefined} className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-50">
            <div className={`h-2 rounded-full bg-neutral-600 ${stage === 'processing' || progress === null ? 'upload-indeterminate' : 'transition-[width] duration-300'}`} style={stage === 'uploading' && progress !== null ? { width: `${progress}%` } : undefined} />
          </div>}
        </div>
      )}
      {error && <p className="mt-3 text-sm font-semibold text-neutral-600">{error}</p>}
    </section>
  )
}

export default FileUpload
