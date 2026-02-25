import { useState, useCallback, useRef } from 'react'

function getOrCreateSessionId() {
  const key = 'iago_session'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

export function useChat(webhookUrl, greeting) {
  const sessionId = useRef(getOrCreateSessionId())
  const greetingFired = useRef(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const triggerGreeting = useCallback(() => {
    if (greetingFired.current) return
    greetingFired.current = true
    setTimeout(() => {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text: greeting,
          ts: Date.now(),
          showQuickReplies: [
            'What services do you offer?',
            'Show me pricing',
            'Book a discovery call',
            'How does AI automation work?',
          ],
        },
      ])
    }, 600)
  }, [greeting])

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const userMsg = { id: crypto.randomUUID(), role: 'user', text: trimmed, ts: Date.now() }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      try {
        const url = new URL(webhookUrl)
        url.searchParams.set('chatInput', trimmed)
        url.searchParams.set('sessionId', sessionId.current)

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        const botText =
          data.output ||
          data.text ||
          data.message ||
          data.reply ||
          'Sorry, I could not understand the response.'

        const botMsg = { id: crypto.randomUUID(), role: 'bot', text: botText, ts: Date.now() }
        setMessages((prev) => [...prev, botMsg])
      } catch (err) {
        const errorMsg = {
          id: crypto.randomUUID(),
          role: 'bot',
          text: `Something went wrong. Please try again. (${err.message})`,
          ts: Date.now(),
          isError: true,
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [webhookUrl, isLoading]
  )

  return { messages, isLoading, sendMessage, triggerGreeting }
}
