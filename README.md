<div align="center">

<h1>⚡ ForgeAI</h1>
<p><strong>Version 1.0</strong></p>

<p>
  <em>A full-stack AI assistant powered by Llama 3.3 — with real-time web search, image generation, OCR, and Google OAuth.</em>
</p>

<p>
  <img src="https://img.shields.io/badge/version-v1.0-blueviolet?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Groq-Llama 3.3-F55036?style=for-the-badge" alt="Groq" />
  <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deployed-Render%20%26%20Vercel-430098?style=for-the-badge" alt="Deployment" />
</p>

<p>
  <a href="https://forge-ai-kohl.vercel.app"><strong>🌐 Live Demo →</strong></a>
</p>

</div>

---

## 📖 Overview

**ForgeAI** is a production-ready, full-stack AI chat application that brings together the power of **Llama 3.3 70B** (via Groq), real-time **web search**, **AI image generation**, and **document OCR** — all wrapped in a sleek, modern Next.js frontend with complete user authentication.

It intelligently routes each user query through a smart decision engine: answering conversationally, searching the web for live data, or generating images — all in real time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Chat** | Powered by `llama-3.3-70b-versatile` via Groq API with conversation history |
| 🔍 **Smart Web Search** | Auto-detects when to search the web and injects live results into the AI context |
| 🎨 **Image Generation** | Generates images via Pollinations.AI (Flux model) from natural language prompts |
| 📄 **OCR / File Analysis** | Upload documents and let the AI extract and analyze text |
| 🔐 **Authentication** | Full auth system with Email/Password + Google OAuth via Supabase |
| 💬 **Chat History** | Persistent session-based conversation memory |
| ⚡ **Streaming UI** | Word-by-word streaming animation with blinking cursor for a live typing feel |
| 📋 **Code Highlighting** | Syntax highlighting with one-click copy for code blocks |
| 📱 **Responsive Design** | Optimized for both desktop and mobile |

---

## 🏗️ Architecture

```
ForgeAI/
├── 🐍 Backend (FastAPI — deployed on Render)
│   ├── api.py           # REST API endpoints (chat, OCR, image generation)
│   ├── auth.py          # Supabase auth routes (signup, login, Google OAuth)
│   ├── brain.py         # Core AI logic, smart routing, Groq LLM integration
│   ├── web_search.py    # Real-time web search integration
│   ├── image_gen.py     # Pollinations.AI image generation
│   ├── ocr.py           # Document OCR handler
│   ├── memory.py        # Session-based conversation memory
│   └── prompts/         # System personality & prompt templates
│
└── ⚛️  Frontend (Next.js 15 — deployed on Vercel)
    ├── app/
    │   ├── chat/        # Main chat interface
    │   ├── signin/      # Sign-in page
    │   ├── signup/      # Sign-up page
    │   └── auth/callback/ # OAuth callback handler
    ├── components/chat/ # Chat UI components (messages, sidebar, chatbar)
    ├── hooks/           # Custom React hooks (useAuth)
    └── lib/             # API client & auth utilities
```

---

## 🧠 How the AI Routing Works

Every user message passes through a **smart routing engine** before getting a response:

```
User Message
     │
     ▼
┌─────────────────────┐
│   Routing Engine    │  (llama-3.1-8b-instant — fast & lightweight)
│                     │
│  SEARCH / IMAGE /   │
│    NO_SEARCH        │
└─────────────────────┘
     │
     ├── IMAGE    → Pollinations.AI (Flux model) → Image URL
     ├── SEARCH   → Web Search → Inject results into context → Llama 3.3 70B
     └── NO_SEARCH → Llama 3.3 70B with conversation history
```

---

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — High-performance Python web framework
- **[Groq](https://groq.com/)** — Ultra-fast LLM inference (Llama 3.3 70B & 3.1 8B)
- **[Supabase](https://supabase.com/)** — Auth, database, and OAuth
- **[Pollinations.AI](https://pollinations.ai/)** — Free AI image generation

### Frontend
- **[Next.js 15](https://nextjs.org/)** — React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe development
- **[Supabase JS](https://supabase.com/docs/reference/javascript)** — Client-side auth

### Deployment
- **[Render](https://render.com/)** — Backend hosting (Python/FastAPI)
- **[Vercel](https://vercel.com/)** — Frontend hosting (Next.js)

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com/)
- A [Supabase](https://supabase.com/) project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/forgeai.git
cd forgeai
```

### 2. Backend Setup

```bash
# Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

Start the backend server:

```bash
uvicorn api:app --reload
```

The API will be running at `http://localhost:8000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## 🔌 API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/chat` | Send a message and get an AI reply | No |
| `POST` | `/ocr` | Upload a file for OCR text extraction | No |
| `POST` | `/generate-image` | Generate an image from a text prompt | No |
| `POST` | `/auth/signup` | Register a new user | No |
| `POST` | `/auth/login` | Login and receive access token | No |
| `GET`  | `/auth/me` | Get current user profile | Yes |
| `GET`  | `/auth/google` | Initiate Google OAuth flow | No |

---

## ☁️ Deployment

### Backend → Render

The `render.yaml` at the root configures automatic deployment to Render:

```yaml
services:
  - type: web
    name: forgeai-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn api:app --host 0.0.0.0 --port $PORT
```

Add your environment variables (`GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`) in the Render dashboard.

### Frontend → Vercel

Connect the `frontend/` directory to a Vercel project. Add the following environment variables in the Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL  (your Render backend URL)
```

---

## 📁 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `GROQ_API_KEY` | Backend `.env` | Groq API key for LLM inference |
| `SUPABASE_URL` | Backend `.env` | Supabase project URL |
| `SUPABASE_KEY` | Backend `.env` | Supabase service/anon key |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend `.env.local` | Supabase URL for client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend `.env.local` | Supabase anon key for client |
| `NEXT_PUBLIC_API_URL` | Frontend `.env.local` | Backend API base URL |

---

## 🗺️ Roadmap

- [ ] Multi-session chat history with Supabase database
- [ ] File upload support in the chat interface (drag & drop)
- [ ] Voice input / text-to-speech output
- [ ] Custom AI persona configuration per user
- [ ] Plugin/tool system for extensibility

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Harshey Golar](https://github.com/your-username)**

⭐ Star this repo if you found it useful!

</div>