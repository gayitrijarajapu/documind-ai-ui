import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import DocumentChat from './pages/DocumentChat'
import Documents from './pages/Documents'
import {
  deleteDocument as deleteDocumentApi,
  fetchDashboardStats,
  fetchDocument,
  fetchDocuments,
  getApiErrorMessage,
  uploadDocument,
} from './services/api'

function App() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [activeDocumentId, setActiveDocumentId] = useState()
  const [apiStatus, setApiStatus] = useState('checking')
  const [dashboardStats, setDashboardStats] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const activeDocument = useMemo(
    () => documents.find((document) => document.id === activeDocumentId) ?? documents[0],
    [activeDocumentId, documents],
  )

  const refreshDashboard = async () => {
    const [documentData, statsData] = await Promise.all([fetchDocuments(), fetchDashboardStats()])
    setDocuments(documentData)
    setDashboardStats(statsData)
    setActiveDocumentId((current) => current ?? documentData[0]?.id)
    setApiStatus('connected')
    return documentData
  }

  const waitForDocumentProcessing = async (documentId) => {
    let latestDocument
    for (let attempt = 0; attempt < 8; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      latestDocument = await fetchDocument(documentId)
      setDocuments((current) =>
        current.map((item) => (item.id === latestDocument.id ? latestDocument : item)),
      )
      if (latestDocument.status !== 'Processing') break
    }
    return latestDocument
  }

  useEffect(() => {
    setLoading(true)
    refreshDashboard()
      .catch(() => {
        setApiStatus('error')
        setError('Could not connect to FastAPI at http://127.0.0.1:8000.')
      })
      .finally(() => setLoading(false))
  }, [])

  const openDocument = async (id) => {
    setActiveDocumentId(id)
    try {
      const document = await fetchDocument(id)
      setDocuments((current) => current.map((item) => (item.id === id ? document : item)))
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Could not load this document. Please try again.'))
    }
  }

  const addDocument = async (file, onProgress) => {
    setError('')
    let document = await uploadDocument(file, onProgress)
    onProgress?.(100)
    setDocuments((current) => [document, ...current])
    setActiveDocumentId(document.id)
    if (document.status === 'Processing') {
      document = await waitForDocumentProcessing(document.id)
    }
    await refreshDashboard()
    setActiveDocumentId(document.id)
    navigate('/chat')
    return document
  }

  const deleteDocument = async (id) => {
    setError('')
    await deleteDocumentApi(id)
    const nextDocuments = await refreshDashboard()
    if (activeDocumentId === id) {
      setActiveDocumentId(nextDocuments.find((document) => document.id !== id)?.id)
    }
  }

  const refreshActiveDocument = async () => {
    if (!activeDocument?.id) return
    const document = await fetchDocument(activeDocument.id)
    setDocuments((current) => current.map((item) => (item.id === document.id ? document : item)))
  }

  return (
    <div className="h-screen overflow-hidden text-neutral-950">
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
          <Navbar apiStatus={apiStatus} documentsCount={documents.length} />
          {error && (
            <div className="mx-4 mt-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-950 md:mx-5">
              {error}
            </div>
          )}
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  documents={documents}
                  activeDocument={activeDocument}
                  loading={loading}
                  stats={dashboardStats}
                  onUpload={addDocument}
                  onOpenDocument={openDocument}
                  onDeleteDocument={deleteDocument}
                />
              }
            />
            <Route
              path="/documents"
              element={
                <Documents
                  documents={documents}
                  activeDocument={activeDocument}
                  activeDocumentId={activeDocument?.id}
                  loading={loading}
                  onUpload={addDocument}
                  onOpenDocument={openDocument}
                  onDeleteDocument={deleteDocument}
                />
              }
            />
            <Route
              path="/chat"
              element={
                <DocumentChat
                  document={activeDocument}
                  onDocumentUpdated={refreshActiveDocument}
                  onUpload={addDocument}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
