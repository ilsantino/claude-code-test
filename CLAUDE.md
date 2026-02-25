# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at localhost:5173 (opens browser automatically)
npm run build        # Standard Vite build → dist/ (for demo page verification)
npm run build:lib    # Library bundle → dist/iago-chat-widget.iife.js + .css
npm run preview      # Preview the standard build locally
```

There are no tests or linting configured yet.

## Architecture

This project has **two separate entry points** that serve different purposes:

| Entry | Config | Purpose |
|-------|--------|---------|
| `src/main.jsx` | `vite.config.js` | Mounts the widget via `createRoot('#root')` for local dev/demo |
| `src/widget-entry.js` | `vite.config.lib.js` | Exposes `window.IagoChatWidget.init()` as an IIFE for embedding |

The library build bundles React itself (nothing is external) so the output JS is fully self-contained.

## Widget Initialisation Flow

`widget-entry.js` → injects `--iago-brand` CSS custom property → appends a `<div>` to `<body>` → `createRoot().render(<ChatWidget />)`

`ChatWidget` → manages `isOpen` state → renders `<ChatBubble>` always + `<ChatWindow>` when open

## State & Data Flow

- **`useChat(webhookUrl, greeting)`** — owns `messages[]`, `isLoading`, and `sessionId` (stored in `sessionStorage` as `iago_session`, survives page navigation, resets on tab close). Sends `{ chatInput, sessionId }` to the n8n webhook; reads the reply from `data.output` (with fallbacks to `.text`, `.message`, `.reply`).
- **`useVoice(onTranscript)`** — wraps `SpeechRecognition`; calls `onTranscript(text)` on final result, which `MessageInput` uses to populate the text field.

## Styling Convention

All CSS lives in `src/widget.css`. Every class is prefixed `.iago-widget-*` to prevent collisions with host-site styles. The brand colour is applied via the `--iago-brand` CSS custom property (set at `:root` by `widget-entry.js`). Direct inline `style={{ background: brandColor }}` is used on the bubble and header since those elements need the colour before React renders.

## n8n Webhook Protocol

```
POST {webhookUrl}
Content-Type: application/json
Body:    { "chatInput": "user text", "sessionId": "uuid" }
Response: { "output": "bot reply" }
```

The webhook URL defaults to a placeholder in `src/main.jsx`; swap it for the real n8n URL when testing live responses.

## Embed Snippet (production)

```html
<link rel="stylesheet" href="[cdn]/iago-chat-widget.css" />
<script src="[cdn]/iago-chat-widget.iife.js"></script>
<script>
  IagoChatWidget.init({
    webhookUrl: 'https://your-n8n.com/webhook/ID',
    brandColor: '#6366f1',
    greeting: "Hi! I'm iaGO's assistant. How can I help you today?"
  });
</script>
```

Note: `build:lib` produces `iago-chat-widget.iife.js` (Vite appends `.iife` to the filename).
