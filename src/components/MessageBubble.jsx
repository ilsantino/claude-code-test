import React from 'react'
import { renderMarkdown } from '../utils/renderMarkdown.jsx'

export function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`iago-widget-msg${isUser ? ' iago-widget-msg--user' : ' iago-widget-msg--bot'}${
        message.isError ? ' iago-widget-msg--error' : ''
      }`}
    >
      <div className="iago-widget-msg-bubble">
        {isUser ? message.text : renderMarkdown(message.text)}
      </div>
    </div>
  )
}
