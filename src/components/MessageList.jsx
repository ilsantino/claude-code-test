import React, { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble.jsx'
import { QuickReplies } from './QuickReplies.jsx'

function TypingIndicator() {
  return (
    <div
      className="iago-widget-msg iago-widget-msg--bot"
      role="status"
      aria-label="iaGO assistant is typing"
    >
      <div className="iago-widget-msg-bubble iago-widget-typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

export function MessageList({ messages, isLoading, onSend }) {
  const bottomRef = useRef(null)
  const hasUserMessage = messages.some((m) => m.role === 'user')

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  return (
    <div
      className="iago-widget-messages"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Chat messages"
    >
      {messages.map((msg) => (
        <React.Fragment key={msg.id}>
          <MessageBubble message={msg} />
          {msg.showQuickReplies && !hasUserMessage && (
            <QuickReplies
              chips={msg.showQuickReplies}
              onSelect={onSend}
              disabled={isLoading}
            />
          )}
        </React.Fragment>
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
