# Frontend Integration Guide: AskDoubt AI

This document provides the necessary details to connect your Frontend (React/Next.js/etc.) to the live AskDoubt backend.

## 🔗 Connection Details
- **Base URL**: `https://askdoubt-backend.onrender.com`
- **Socket.IO Namespace**: `/` (default)
- **Protocol**: HTTPS (Port 443)

---

## ⚡ Socket.IO Integration (Real-time Chat)

We recommend using the `socket.io-client` library.

### 1. Connection Setup
When connecting, you **must** pass `video_id`, `user_id`, and `session_id` as query parameters so the backend can establish context.

```javascript
import { io } from "socket.io-client";

const socket = io("https://askdoubt-backend.onrender.com", {
  query: {
    video_id: "waves",
    user_id: "user_123",
    session_id: "session_456"
  }
});
```

### 2. Events

| Event Name | Type | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `chat_message` | Emit | Send a message to the AI | `{ user_id, session_id, message }` |
| `chat_response` | Listen | Receive AI answer | `{ type, ai_response, query, data }` |

**Sending a message:**
```javascript
socket.emit("chat_message", {
  user_id: "user_123",
  session_id: "session_456",
  message: "Explain what is a transverse wave."
});
```

**Receiving a response:**
```javascript
socket.on("chat_response", (data) => {
  // data is a JSON string or object depending on your client config
  const response = typeof data === 'string' ? JSON.parse(data) : data;
  console.log("AI Answer:", response.ai_response);
});
```

---

## 🌐 HTTP Endpoints (GET)

### 1. Fetch Chat History
Use this to load previous messages when a user reloads the page.
- **URL**: `/get-all-chat`
- **Params**: `user_id`, `video_id`, `session_id`
- **Example**: `GET /get-all-chat?user_id=test&video_id=waves&session_id=123`

### 2. Generate/Fetch Quiz
- **URL**: `/get-quiz`
- **Params**: `video_id`
- **Example**: `GET /get-quiz?video_id=waves`

### 3. Generate/Fetch Flashcards
- **URL**: `/ai-flashcards`
- **Params**: `video_id`
- **Example**: `GET /ai-flashcards?video_id=waves`

### 4. Health Check
- **URL**: `/`
- **Returns**: `{ "status": "live", "message": "..." }`

---

## 💡 Best Practices
1. **Loading States**: AI generation for Quizzes and Flashcards can take 5-10 seconds. Ensure your UI shows a proper loading skeleton.
2. **Context Clipping**: The backend returns citations in format `[MM:SS]`. You can use regex to turn these into clickable links that jump to that timestamp in your video player.
3. **Reconnect Logic**: Render free tier services go to "sleep" after 15 mins of inactivity. The first request might take 30-50 seconds to "wake up" the server.
