import React from 'react'
import { MessageList } from './MessageList.jsx'
import { MessageInput } from './MessageInput.jsx'

export function ChatWindow({ messages, isLoading, onSend, onClose, brandColor }) {
  return (
    <div className="iago-widget-window">
      {/* Header */}
      <div className="iago-widget-header" style={{ background: brandColor }}>
        <div className="iago-widget-header-info">
          <div className="iago-widget-avatar" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div className="iago-widget-header-name">iaGO Assistant</div>
            <div className="iago-widget-header-status">
              <span className="iago-widget-status-dot" />
              Online
            </div>
          </div>
        </div>
        <button
          className="iago-widget-close-btn"
          onClick={onClose}
          aria-label="Close chat"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} onSend={onSend} />

      {/* Input */}
      <MessageInput onSend={onSend} isLoading={isLoading} />
    </div>
  )
}
