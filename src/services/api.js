import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
})

export async function uploadDocument(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/api/documents/upload', formData)
  return response.data
}

export async function fetchDocuments() {
  const response = await api.get('/api/documents')
  return response.data
}

export async function deleteDocument(documentId) {
  const response = await api.delete(`/api/documents/${documentId}`)
  return response.data
}

export async function askDocument(documentId, question, sessionId) {
  const response = await api.post('/api/chat/ask', {
    document_id: documentId,
    question,
    session_id: sessionId,
  })
  return response.data
}

export async function summarizeDocument(documentId) {
  const response = await api.post(`/api/documents/${documentId}/summary`)
  return response.data
}

export async function extractDocumentFields(documentId) {
  const response = await api.post(`/api/documents/${documentId}/extract`)
  return response.data
}

export async function fetchDashboardStats() {
  const response = await api.get('/api/dashboard/stats')
  return response.data
}

export default api
