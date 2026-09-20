import { Check, Copy, ThumbsDown, ThumbsUp } from 'lucide-react'
import SourceReference from './SourceReference'

function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[86%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-lg px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? 'bg-black text-white'
              : 'border border-neutral-200 bg-white text-neutral-700'
          }`}
        >
          {message.content}
          {!!message.sources?.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.sources.map((source) => (
                <SourceReference key={`${source.page}-${source.label}`} source={source} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
          <span>{message.createdAt}</span>
          {!isUser && (
            <>
              <button className="hover:text-neutral-700" title="Copy answer" type="button">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button className="hover:text-neutral-950" title="Helpful" type="button">
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <button className="hover:text-neutral-950" title="Not helpful" type="button">
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
              <Check className="h-3.5 w-3.5 text-neutral-500" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
