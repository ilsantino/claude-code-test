import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChatWidget } from './ChatWidget.jsx'

createRoot(document.getElementById('root')).render(
  <ChatWidget
    webhookUrl={import.meta.env.VITE_N8N_WEBHOOK_URL || ''}
    brandColor="#6366f1"
    greeting="Hi! I'm iaGO's assistant. How can I help you today?"
  />
)
