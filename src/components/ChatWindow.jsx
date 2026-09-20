import { useState } from 'react'
import { Loader2, SendHorizontal } from 'lucide-react'
import AppLogo from './AppLogo'
import ChatMessage from './ChatMessage'
import { askDocument } from '../services/api'

const suggestions = [
  'Summarize this document',
  'What are the risks?',
  'Find important details',
  'Show source pages',
]

function ChatWindow({ document }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello. I am ready to answer questions, summarize sections, and cite the source pages from your selected document.',
      sources: [],
      createdAt: 'Just now',
    },
  ])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState()

  const sendMessage = async () => {
    if (!question.trim() || loading) return

    const submittedQuestion = question
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: submittedQuestion,
      createdAt: 'Now',
    }
    setMessages((current) => [...current, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      const response = await askDocument(document.id, submittedQuestion, sessionId)
      setSessionId(response.session_id)
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.answer,
          sources: response.sources,
          createdAt: 'Now',
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'I could not reach the backend for this question. Please check the API server.',
          sources: [],
          createdAt: 'Now',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-[520px] flex-col border-l border-neutral-200 bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-3 py-3">
        <div className="flex items-center gap-3">
          <AppLogo className="h-9 w-9 rounded-full" imageClassName="h-7 w-7" />
          <div>
            <h2 className="font-semibold text-neutral-950">AI Assistant</h2>
            <p className="text-xs text-neutral-500">Ready to answer from · {document.title}</p>
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Reading cited pages
          </div>
        )}
      </div>
      <div className="border-t border-neutral-200 bg-white p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
              key={suggestion}
              onClick={() => setQuestion(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-2"
          onSubmit={(event) => {
            event.preventDefault()
            sendMessage()
          }}
        >
          <input
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-400"
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask any question about your document"
            value={question}
          />
          <button
            className="grid h-9 w-9 place-items-center rounded-full bg-black text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            disabled={!question.trim() || loading}
            title="Send question"
            type="submit"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-neutral-400">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </section>
  )
}

export default ChatWindow
