export function Message({ from, children }) {
  return <div className={`flex items-start gap-2 ${from === 'user' ? 'justify-end' : 'justify-start'}`}>{children}</div>
}
export function MessageContent({ children, className = '' }) {
  return <div className={`min-w-0 ${className}`}>{children}</div>
}
