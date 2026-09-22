export function Orb({ agentState = null, className = '' }) {
  return <span role="img" aria-label={agentState === 'talking' ? 'Assistant responding' : 'AI assistant'} className={`assistant-orb ${agentState === 'talking' ? 'is-talking' : ''} ${className}`} />
}
