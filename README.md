# SyncFlix — Real-Time Group Streaming Platform

Full-stack application: React.js (TypeScript) frontend + Python (FastAPI + Socket.IO) backend.

## Project Structure

```
syncflix/
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # Zustand global state
│   │   ├── services/           # API + Socket clients
│   │   ├── types/              # TypeScript interfaces
│   │   └── styles/             # Global CSS
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                    # Python FastAPI + Socket.IO
│   ├── app/
│   │   ├── main.py             # App entry point
│   │   ├── config.py           # Settings / env
│   │   ├── routes/             # REST API routers
│   │   ├── services/           # Business logic
│   │   ├── models/             # Pydantic models
│   │   └── utils/              # Helpers
│   ├── tests/                  # Pytest test suite
│   ├── requirements.txt
│   └── .env.example
│
└── docker-compose.yml          # One-command launch
```

## Quick Start

### Option 1 — Docker (recommended)
```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# API docs: http://localhost:8000/docs
```

### Option 2 — Manual

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | changeme | JWT signing key |
| `DATABASE_URL` | sqlite:///./syncflix.db | Database URL |
| `CORS_ORIGINS` | http://localhost:5173 | Allowed CORS origins |
| `VITE_API_URL` | http://localhost:8000 | Backend URL |
| `VITE_WS_URL` | ws://localhost:8000 | WebSocket URL |

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login → JWT |
| GET | /api/rooms | List all rooms |
| POST | /api/rooms | Create room |
| GET | /api/rooms/{id} | Get room detail |
| DELETE | /api/rooms/{id} | Delete room |
| WS | /ws/{room_id} | Real-time socket |

## Socket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join_room` | Client→Server | `{room_id, user_id}` |
| `leave_room` | Client→Server | `{room_id}` |
| `player_play` | Client→Server | `{position}` |
| `player_pause` | Client→Server | `{position}` |
| `player_seek` | Client→Server | `{position}` |
| `chat_message` | Client→Server | `{text}` |
| `reaction` | Client→Server | `{emoji}` |
| `sync_state` | Server→Client | `{playing, position, viewers}` |
| `chat_broadcast` | Server→Client | `{user, text, ts}` |
| `viewer_joined` | Server→Client | `{user}` |
| `viewer_left` | Server→Client | `{user}` |
