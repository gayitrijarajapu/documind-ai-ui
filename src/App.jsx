import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import DocumentChat from './pages/DocumentChat'
import Documents from './pages/Documents'
import { mockDocuments } from './data/mockData'
import { deleteDocument as deleteDocumentApi, fetchDocuments, uploadDocument } from './services/api'

function App() {
  const [documents, setDocuments] = useState([])
  const [activeDocumentId, setActiveDocumentId] = useState()
  const [apiStatus, setApiStatus] = useState('checking')

  const activeDocument = useMemo(
    () => documents.find((document) => document.id === activeDocumentId) ?? documents[0],
    [activeDocumentId, documents],
  )

  useEffect(() => {
    fetchDocuments()
      .then((data) => {
        setDocuments(data)
        setActiveDocumentId((current) => current ?? data[0]?.id)
        setApiStatus('connected')
      })
      .catch(() => {
        setDocuments(mockDocuments)
        setActiveDocumentId((current) => current ?? mockDocuments[0]?.id)
        setApiStatus('demo')
      })
  }, [])

  const addDocument = async (file) => {
    let document
    if (apiStatus === 'connected') {
      document = await uploadDocument(file)
    } else {
      document = {
        id: crypto.randomUUID(),
        title: file.name.replace(/\.pdf$/i, ''),
        fileName: file.name,
        uploadedAt: 'Just now',
        status: 'Processing',
        size: `${Math.max(file.size / 1024 / 1024, 0.1).toFixed(1)} MB`,
        pages: Math.max(8, Math.round(file.size / 75000)),
        category: 'Uploaded',
        summary:
          'Demo upload added locally. Connect FastAPI to process this document for real page references, summaries, and document details.',
        keyPoints: ['Upload received', 'Processing pending', 'Backend connection required'],
        fields: { Type: 'PDF', Status: 'Demo only', Confidence: 'Pending' },
      }
    }
    setDocuments((current) => [document, ...current])
    setActiveDocumentId(document.id)
  }

  const deleteDocument = async (id) => {
    if (apiStatus === 'connected') {
      await deleteDocumentApi(id)
    }
    setDocuments((current) => current.filter((document) => document.id !== id))
    if (activeDocumentId === id) {
      setActiveDocumentId(documents.find((document) => document.id !== id)?.id)
    }
  }

  return (
    <div className="h-screen overflow-hidden text-neutral-950">
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
          <Navbar apiStatus={apiStatus} documentsCount={documents.length} />
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  documents={documents}
                  activeDocument={activeDocument}
                  onUpload={addDocument}
                  onOpenDocument={setActiveDocumentId}
                />
              }
            />
            <Route
              path="/documents"
              element={
                <Documents
                  documents={documents}
                  activeDocumentId={activeDocument?.id}
                  onOpenDocument={setActiveDocumentId}
                  onDeleteDocument={deleteDocument}
                />
              }
            />
            <Route
              path="/chat"
              element={<DocumentChat document={activeDocument} onUpload={addDocument} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
