import { useEffect, useState } from 'react'
import { Copy, Loader2, SendHorizontal, Sparkles, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { askDocument, fetchChatHistory, getApiErrorMessage } from '../services/api'
import AppLogo from './AppLogo'
import ChatMessage from './ChatMessage'

const suggestions = [
  'Summarize this document',
  'What is the internship period?',
  'Who issued this certificate?',
  'What are the key details?',
  'Show source page number',
]

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I've analyzed this document and I'm ready to help. You can ask me questions, request a summary, or find specific details from this document.",
  sources: [],
  createdAt: 'Just now',
}

function ChatWindow({ document, disabled = false }) {
  const [messages, setMessages] = useState([welcomeMessage])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState()

  useEffect(() => {
    setMessages([welcomeMessage])
    setQuestion('')
    setSessionId()
  }, [document.id])

  const clearChat = () => {
    setMessages([welcomeMessage])
    setQuestion('')
    setSessionId()
  }

  const sendMessage = async (presetQuestion = question) => {
    if (!presetQuestion.trim() || loading || disabled) return

    const submittedQuestion = presetQuestion
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: submittedQuestion,
        createdAt: 'Now',
      },
    ])
    setQuestion('')
    setLoading(true)

    try {
      const response = await askDocument(document.id, submittedQuestion, sessionId)
      setSessionId(response.session_id)

      try {
        const history = await fetchChatHistory(response.session_id)
        if (history.length) {
          setMessages(history)
          return
        }
      } catch {
        // Keep the current answer when persisted history is unavailable.
      }

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
    } catch (chatError) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: getApiErrorMessage(
            chatError,
            'I could not answer that question. Please check the API server and try again.',
          ),
          sources: [],
          createdAt: 'Now',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex h-full min-h-[760px] flex-col rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-4">
          <AppLogo className="h-10 w-10 rounded-xl" imageClassName="h-9 w-9" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">AI Assistant</h2>
            <p className="text-sm font-medium text-slate-500">
              {disabled ? 'Available after indexing' : `Ready to answer from · ${document.fileName}`}
            </p>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
          onClick={clearChat}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
          Clear chat
        </button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
        {messages.map((message) =>
          message.id === 'welcome' ? (
            <AssistantIntro key={message.id} message={message} />
          ) : (
            <ChatMessage key={message.id} message={message} />
          ),
        )}
        {loading && (
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Reading cited pages
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold text-slate-950">
            <Sparkles className="h-5 w-5 text-slate-500" />
            Suggested questions
          </h3>
          <div className="flex flex-col items-start gap-3">
            {suggestions.map((suggestion) => (
              <button
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={disabled || loading}
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-slate-100 px-5 pb-5 pt-4">
        <form
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            sendMessage()
          }}
        >
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            disabled={disabled}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={disabled ? 'Chat is available after indexing' : 'Ask any question about this document...'}
            value={question}
          />
          <button
            className="grid h-11 w-11 place-items-center rounded-full bg-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!question.trim() || loading || disabled}
            title="Send question"
            type="submit"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </form>
        <p className="mt-4 text-center text-sm font-medium text-slate-400">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </section>
  )
}

function AssistantIntro({ message }) {
  return (
    <div>
      <div className="max-w-[78%] rounded-xl border border-slate-200 bg-white px-5 py-4 text-base font-medium leading-7 text-slate-800 shadow-sm">
        {message.content}
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm font-medium text-slate-500">
        <span>{message.createdAt}</span>
        <button className="hover:text-slate-950" title="Copy answer" type="button">
          <Copy className="h-4 w-4" />
        </button>
        <button className="hover:text-slate-950" title="Helpful" type="button">
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button className="hover:text-slate-950" title="Not helpful" type="button">
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
