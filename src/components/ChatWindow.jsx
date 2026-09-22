import { useEffect, useRef, useState } from 'react'
import { Copy, Loader2, SendHorizontal, Sparkles, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { askDocument, getApiErrorMessage } from '../services/api'
import AppLogo from './AppLogo'
import ChatMessage from './ChatMessage'

const suggestions = [
  'Summarize this document',
  'What are the key points?',
  'What is the purpose of this document?',
  'What important details should I know?',
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
  const [stream, setStream] = useState(null)
  const generation = useRef(0)
  const busy = useRef(false)
  const remainingSuggestions = suggestions.filter(suggestion =>
    !messages.some(message => message.role === 'user' && message.content.trim().toLowerCase() === suggestion.toLowerCase()),
  )

  useEffect(() => {
    if (!stream) return
    const tokens = stream.content.match(/\S+\s*|\s+/g) ?? []
    let index = 0
    const timer = setInterval(() => {
      index = Math.min(index + Math.max(1, Math.ceil(tokens.length / 120)), tokens.length)
      setMessages(current => current.map(message => message.id === stream.id ? { ...message, content: tokens.slice(0, index).join('') } : message))
      if (index >= tokens.length) {
        clearInterval(timer)
        setStream(null)
        setLoading(false)
        busy.current = false
      }
    }, 35)
    return () => clearInterval(timer)
  }, [stream])

  useEffect(() => {
    generation.current++
    busy.current = false
    setStream(null)
    setLoading(false)
    setMessages([welcomeMessage])
    setQuestion('')
    setSessionId()
    const activeGeneration = generation
    return () => { activeGeneration.current++ }
  }, [document.id])

  const clearChat = () => {
    generation.current++
    busy.current = false
    setStream(null)
    setLoading(false)
    setMessages([welcomeMessage])
    setQuestion('')
    setSessionId()
  }

  const sendMessage = async (presetQuestion = question) => {
    if (!presetQuestion.trim() || busy.current || disabled) return
    busy.current = true
    const requestGeneration = generation.current

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
      if (generation.current !== requestGeneration) return
      setSessionId(response.session_id)
      const id = crypto.randomUUID()
      const content = response.answer || 'No answer was returned. Please try again.'
      setMessages(current => [...current, { id, role: 'assistant', content: '', sources: response.sources, createdAt: 'Now' }])
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setMessages(current => current.map(message => message.id === id ? { ...message, content } : message))
        setLoading(false)
        busy.current = false
      } else {
        setStream({ id, content })
      }
    } catch (chatError) {
      if (generation.current !== requestGeneration) return
      busy.current = false
      setLoading(false)
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
    }
  }

  return (
    <section className="chat-window flex h-full min-h-0 flex-col rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
      <header className="flex items-center justify-between gap-3 shrink-0 border-b border-neutral-200 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 lg:gap-4">
          <AppLogo className="h-10 w-10 rounded-xl" imageClassName="h-9 w-9" />
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-neutral-950">AI Assistant</h2>
            <p className="truncate text-sm font-medium text-neutral-500">
              {disabled ? 'Available after indexing' : `Ready to answer from · ${document.fileName}`}
            </p>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
          onClick={clearChat}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
          Clear chat
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) =>
          message.id === 'welcome' ? (
            <AssistantIntro key={message.id} message={message} />
          ) : (
            <ChatMessage key={message.id} message={message} isStreaming={stream?.id === message.id} />
          ),
        )}
        {loading && !stream && (
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Reading cited pages
          </div>
        )}

        {remainingSuggestions.length > 0 && <section className="py-1">
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
            <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
            Suggested questions
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {remainingSuggestions.map((suggestion) => (
              <button
                className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-left text-xs font-medium leading-5 text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={disabled}
                title={loading ? "Use as your next question" : suggestion}
                key={suggestion}
                onClick={() => busy.current ? setQuestion(suggestion) : sendMessage(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>}
      </div>

      <div className="shrink-0 border-t border-neutral-100 px-4 pb-3 pt-3">
        <form
          className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            sendMessage()
          }}
        >
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed"
            disabled={disabled}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={disabled ? 'Chat is available after indexing' : 'Ask any question about this document...'}
            value={question}
          />
          <button
            className="grid h-8 w-8 place-items-center rounded-full bg-black text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            disabled={!question.trim() || loading || disabled}
            title="Send question"
            type="submit"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </form>
        <p className="mt-4 text-center text-sm font-medium text-neutral-400">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </section>
  )
}

function AssistantIntro({ message }) {
  return (
    <div className="hidden lg:block">
      <div className="max-w-[78%] rounded-xl border border-neutral-200 bg-white px-5 py-4 text-base font-medium leading-7 text-neutral-800 shadow-sm">
        {message.content}
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm font-medium text-neutral-500">
        <span>{message.createdAt}</span>
        <button className="hover:text-neutral-950" title="Copy answer" type="button">
          <Copy className="h-4 w-4" />
        </button>
        <button className="hover:text-neutral-950" title="Helpful" type="button">
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button className="hover:text-neutral-950" title="Not helpful" type="button">
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
