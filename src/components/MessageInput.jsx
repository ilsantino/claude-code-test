import React, { useState, useCallback, useEffect } from 'react'
import { VoiceButton } from './VoiceButton.jsx'
import { useVoice } from '../hooks/useVoice.js'

export function MessageInput({ onSend, isLoading }) {
  const [inputText, setInputText] = useState('')

  const handleTranscript = useCallback((text) => {
    setInputText(text)
  }, [])

  const { isListening, startListening, stopListening, supported } = useVoice(handleTranscript)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputText.trim() && !isLoading) {
      onSend(inputText)
      setInputText('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className="iago-widget-input-row" onSubmit={handleSubmit}>
      <input
        className="iago-widget-input"
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? 'Listening…' : 'Type a message…'}
        disabled={isLoading}
        aria-label="Message input"
        autoComplete="off"
      />
      <VoiceButton
        isListening={isListening}
        onStart={startListening}
        onStop={stopListening}
        supported={supported}
      />
      <button
        className="iago-widget-send-btn"
        type="submit"
        disabled={!inputText.trim() || isLoading}
        aria-label="Send message"
      >
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
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  )
}
