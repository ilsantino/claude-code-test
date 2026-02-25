import React, { useState, useRef, useEffect } from 'react'
import { ChatBubble } from './components/ChatBubble.jsx'
import { ChatWindow } from './components/ChatWindow.jsx'
import { useChat } from './hooks/useChat.js'
import './widget.css'

function useNudge(delay) {
  const [nudgeVisible, setNudgeVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('iago_nudge_seen')) return
    const timer = setTimeout(() => {
      setNudgeVisible(true)
      localStorage.setItem('iago_nudge_seen', '1')
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!nudgeVisible) return
    const dismissTimer = setTimeout(() => setNudgeVisible(false), 6000)
    return () => clearTimeout(dismissTimer)
  }, [nudgeVisible])

  const dismissNudge = () => setNudgeVisible(false)
  return { nudgeVisible, dismissNudge }
}

export function ChatWidget({
  webhookUrl = 'https://placeholder.example.com/webhook/iago',
  brandColor = '#6366f1',
  greeting = "Hi! I'm iaGO's assistant. How can I help you today?",
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, isLoading, sendMessage, triggerGreeting } = useChat(webhookUrl, greeting)
  const { nudgeVisible, dismissNudge } = useNudge(8000)
  const greetingTriggered = useRef(false)

  const handleBubbleClick = () => {
    dismissNudge()
    if (!greetingTriggered.current) {
      greetingTriggered.current = true
      triggerGreeting()
    }
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="iago-widget-root">
      {isOpen && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          onClose={() => setIsOpen(false)}
          brandColor={brandColor}
        />
      )}
      {nudgeVisible && !isOpen && (
        <div className="iago-widget-nudge">
          Need help? Chat with us!
        </div>
      )}
      <ChatBubble
        isOpen={isOpen}
        onClick={handleBubbleClick}
        brandColor={brandColor}
      />
    </div>
  )
}
