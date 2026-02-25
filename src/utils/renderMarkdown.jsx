import React from 'react'

// Parse **bold**, *italic*, `code` within a line of text
function parseInline(text, keyPrefix) {
  const result = []
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0
  let match
  let i = 0

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      result.push(text.slice(last, match.index))
    }
    if (match[2] !== undefined) {
      result.push(<strong key={`${keyPrefix}-b${i}`}>{match[2]}</strong>)
    } else if (match[3] !== undefined) {
      result.push(<em key={`${keyPrefix}-i${i}`}>{match[3]}</em>)
    } else if (match[4] !== undefined) {
      result.push(
        <code key={`${keyPrefix}-c${i}`} className="iago-widget-md-code">
          {match[4]}
        </code>
      )
    }
    last = match.index + match[0].length
    i++
  }

  if (last < text.length) {
    result.push(text.slice(last))
  }

  return result.length === 0 ? [text] : result
}

// Convert plain text with markdown to an array of React elements
export function renderMarkdown(text) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const items = []
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(
          <li key={i}>{parseInline(lines[i].replace(/^[-*]\s/, ''), `ul-${i}`)}</li>
        )
        i++
      }
      elements.push(
        <ul key={`ul-block-${i}`} className="iago-widget-md-list">
          {items}
        </ul>
      )
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={i}>{parseInline(lines[i].replace(/^\d+\.\s+/, ''), `ol-${i}`)}</li>
        )
        i++
      }
      elements.push(
        <ol key={`ol-block-${i}`} className="iago-widget-md-list">
          {items}
        </ol>
      )
      continue
    }

    // Empty line — skip
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph
    elements.push(
      <p key={`p-${i}`} className="iago-widget-md-p">
        {parseInline(line, `p-${i}`)}
      </p>
    )
    i++
  }

  return elements.length > 0 ? elements : [text]
}
