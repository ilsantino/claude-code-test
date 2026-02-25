# iaGO Chat Widget

A lightweight, embeddable chat widget built with React 18 + Vite. Drop two tags into any HTML page and get a fully functional AI chat bubble powered by your n8n webhook.

**Live demo:** https://iago-chat-widget.vercel.app

---

## Features

- Chat bubble with open/close toggle
- Greeting message fires on first open (not on page load)
- Quick-reply pill buttons on the greeting
- Nudge tooltip after 8 s on pages where the user hasn't opened the chat
- Voice input via the Web Speech API (no extra dependencies)
- Inline markdown rendering — bold, italic, `code`, and lists
- Brand colour customisable via a single `brandColor` option
- Session continuity via `sessionStorage` (survives page navigation, resets on tab close)
- Fully scoped CSS — all classes prefixed `.iago-widget-*`, zero style leakage
- Accessible: `role="log"` + `aria-live` on the message list, `focus-visible` rings everywhere

---

## Embed (production)

```html
<link rel="stylesheet" href="https://iago-chat-widget.vercel.app/iago-chat-widget.css" />
<script src="https://iago-chat-widget.vercel.app/iago-chat-widget.iife.js"></script>
<script>
  IagoChatWidget.init({
    webhookUrl: 'https://your-n8n.app.n8n.cloud/webhook/YOUR_ID',
    brandColor: '#6366f1',
    greeting: "Hi! I'm iaGO's assistant. How can I help you today?"
  });
</script>
```

### `init()` options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `webhookUrl` | `string` | — | **Required.** Your n8n webhook URL |
| `brandColor` | `string` | `'#6366f1'` | Hex colour for the bubble, header, and send button |
| `greeting` | `string` | Built-in message | Opening message shown when the chat is first opened |

---

## Local development

```bash
# Install dependencies
npm install

# Copy env template and fill in your webhook URL
cp .env.example .env.local
# Edit .env.local: VITE_N8N_WEBHOOK_URL=https://...

# Start dev server (opens browser automatically)
npm run dev
```

The dev server runs at `http://localhost:5173`.

### Build

```bash
npm run build        # Demo page → dist/
npm run build:lib    # Embeddable bundle → dist/iago-chat-widget.iife.js + .css
npm run preview      # Preview the demo build locally
```

### Test the library bundle locally

```bash
npm run build:lib
python -m http.server 8080
# Open http://localhost:8080/test.html
```

---

## n8n Webhook

The widget sends a `GET` request on every message:

```
GET {webhookUrl}?chatInput={encoded_text}&sessionId={uuid}
```

Expected response shape:

```json
{ "output": "Bot reply text here" }
```

The `sessionId` is generated once per browser tab (`sessionStorage` key `iago_session`) and lets n8n maintain per-user conversation context.

---

## Architecture

Two separate entry points serve different purposes:

| Entry | Vite config | Purpose |
|-------|-------------|---------|
| `src/main.jsx` | `vite.config.js` | Mounts widget via `createRoot('#root')` — local dev / demo page |
| `src/widget-entry.js` | `vite.config.lib.js` | Exposes `window.IagoChatWidget.init()` as an IIFE — production embed |

The library build bundles React itself so the output JS is fully self-contained.

### File structure

```
src/
  ChatWidget.jsx          # Root component — open/close state, nudge logic
  widget-entry.js         # IIFE entry: injects CSS var, mounts widget
  widget.css              # All styles (.iago-widget-* prefix)
  main.jsx                # Dev/demo entry point
  components/
    ChatBubble.jsx        # Floating action button
    ChatWindow.jsx        # Chat panel (header + list + input)
    MessageBubble.jsx     # Single message bubble
    MessageList.jsx       # Scrollable message list
    MessageInput.jsx      # Text field + send + voice button
    QuickReplies.jsx      # Pill chip buttons
    VoiceButton.jsx       # Web Speech API trigger
  hooks/
    useChat.js            # Messages state, sessionId, n8n API calls
    useVoice.js           # SpeechRecognition wrapper
  utils/
    renderMarkdown.jsx    # Zero-dep inline markdown → React elements
```

---

## Deployment

The project is configured for Vercel. A `vercel.json` at the root sets the build command and output directory.

The n8n webhook URL is **not** stored in source — it is injected at build time via the `VITE_N8N_WEBHOOK_URL` environment variable set in the Vercel project settings.

> Note: `VITE_*` variables are baked into the client-side JS bundle at build time and are visible in browser DevTools. This is expected — the env var keeps the URL out of git history and makes rotation easy.

To redeploy after changing the env var, trigger a new production build from the Vercel dashboard or push a new commit.
