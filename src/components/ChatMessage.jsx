import { Check, Copy, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Message, MessageContent } from './ui/message'
import { Response } from './ui/response'
import { Orb } from './ui/orb'
import SourceReference from './SourceReference'
import { groupSources } from './sourceGroups'

function ChatMessage({ message, isStreaming = false }) {
  const isUser = message.role === 'user'
  const sources = groupSources(message.sources)

  return (
    <Message from={message.role}>
      <MessageContent className={`max-w-[86%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-lg px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? 'bg-black text-white'
              : 'border border-neutral-200 bg-white text-neutral-700'
          }`}
        >
          <Response>{message.content}</Response>
          {!isUser && !isStreaming && sources.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-neutral-100 pt-3">
              <p className="text-xs font-medium text-neutral-500">Sources · {sources.length}</p>
              {sources.map((source) => (
                <SourceReference key={`${source.page}-${source.label}`} source={source} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
          <span>{message.createdAt}</span>
          {!isUser && (
            <>
              <button onClick={() => navigator.clipboard?.writeText(message.content)} className="hover:text-neutral-700" title="Copy answer" type="button">
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
      </MessageContent>
      {!isUser && <Orb agentState={isStreaming ? "talking" : null} className="h-8 w-8 shrink-0" />}
    </Message>
  )
}

export default ChatMessage
