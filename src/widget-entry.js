import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChatWidget } from './ChatWidget.jsx'

window.IagoChatWidget = {
  /**
   * Initialise the chat widget and mount it into the page.
   *
   * @param {object} options
   * @param {string} options.webhookUrl   - n8n webhook URL (required)
   * @param {string} [options.brandColor] - hex colour, default '#6366f1'
   * @param {string} [options.greeting]   - opening message from bot
   */
  init({ webhookUrl, brandColor = '#6366f1', greeting } = {}) {
    if (!webhookUrl) {
      console.warn('[IagoChatWidget] webhookUrl is required.')
    }

    // Inject CSS custom property so user bubbles & send button honour brandColor
    const style = document.createElement('style')
    style.textContent = `:root { --iago-brand: ${brandColor}; }`
    document.head.appendChild(style)

    const container = document.createElement('div')
    container.id = 'iago-chat-widget-root'
    document.body.appendChild(container)

    createRoot(container).render(
      React.createElement(ChatWidget, { webhookUrl, brandColor, greeting })
    )
  },
}
