// The retrieval API can return several chunks from the same document page.
export function groupSources(sources = []) {
  const groups = new Map()
  for (const source of sources) {
    const label = (source.label || 'Source').replace(/\s*[·•|–-]\s*Chunk\s+\d+\s*$/i, '').trim()
    const key = JSON.stringify([label, source.page ?? null])
    if (!groups.has(key)) groups.set(key, { label, page: source.page, excerpts: [] })
    const text = source.text?.trim()
    const group = groups.get(key)
    if (text && !group.excerpts.includes(text)) group.excerpts.push(text)
  }
  return [...groups.values()]
}
