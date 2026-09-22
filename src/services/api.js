import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
})

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const detail = error?.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).filter(Boolean).join(' ') || fallback
  }
  return detail ?? error?.response?.data?.message ?? error?.message ?? fallback
}

function normalizeDocument(document) {
  return {
    id: document.id,
    title: document.title ?? document.fileName ?? document.file_name ?? 'Untitled document',
    fileName: document.fileName ?? document.file_name ?? document.filename ?? 'document.pdf',
    uploadedAt: document.uploadedAt ?? document.uploaded_at ?? '',
    status: document.status ?? 'Processing',
    size: document.size ?? '',
    pages: document.pages ?? 0,
    category: document.category ?? 'Document',
    summary: document.summary ?? '',
    keyPoints: document.keyPoints ?? document.key_points ?? [],
    fields: document.fields ?? {},
  }
}

function normalizeSource(source) {
  return {
    page: source.page,
    label: source.label ?? source.document_name ?? source.fileName ?? 'Source',
    text: source.text ?? source.relevant_text ?? source.snippet ?? '',
  }
}

function normalizeChatMessage(message) {
  return {
    id: message.id ?? crypto.randomUUID(),
    role: message.role,
    content: message.content,
    sources: (message.sources ?? []).map(normalizeSource),
    createdAt: message.createdAt ?? message.created_at ?? 'Now',
  }
}

export async function uploadDocument(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!event.total || !onProgress) return
      onProgress(Math.round((event.loaded * 100) / event.total))
    },
  })
  return normalizeDocument(response.data)
}

export async function fetchDocuments() {
  const response = await api.get('/api/documents')
  return response.data.map(normalizeDocument)
}

export async function fetchDocument(documentId) {
  const response = await api.get(`/api/documents/${documentId}`)
  return normalizeDocument(response.data)
}

export async function deleteDocument(documentId) {
  const response = await api.delete(`/api/documents/${documentId}`)
  return response.data
}

export async function askDocument(documentId, question, sessionId) {
  const response = await api.post(`/api/chat/documents/${documentId}`, {
    question,
    session_id: sessionId,
  })
  return {
    answer: response.data.answer,
    session_id: response.data.session_id,
    sources: (response.data.sources ?? []).map(normalizeSource),
  }
}

export async function fetchChatHistory(sessionId) {
  const response = await api.get(`/api/chat/${sessionId}`)
  return response.data.map(normalizeChatMessage)
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
