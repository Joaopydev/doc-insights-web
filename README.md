# Doc Insights Web

Frontend for the Doc Insights application — a React interface for authentication, document uploads, and natural-language questions about uploaded content.

## Overview

The application allows users to:

- create accounts and log in
- upload documents for analysis
- track upload status
- start conversations based on specific documents
- ask questions and receive answers in real time
- review recent conversations in the sidebar

The UI consumes the Doc Insights backend API and uses WebSocket to update the processing state of responses.

## Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- TanStack Query
- Zustand
- Tailwind CSS
- Radix UI
- Axios
- Zod + React Hook Form

## Main features

### Authentication

- login screen
- sign-up screen
- local token storage with persistence
- automatic redirect for private and public pages

### Document upload

- file selection with drag-and-drop
- document creation in the backend
- upload to a presigned URL
- list of pending and completed uploads

### Document chat

- conversation creation per document
- question submission via form
- message list for each conversation
- recent conversation history
- processing/in-progress indication via WebSocket

## Project structure

```text
src/
├── components/
│   ├── chat/
│   ├── layouts/
│   ├── message/
│   ├── signin/
│   ├── signup/
│   ├── ui/
│   └── upload/
├── config/
├── contexts/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
├── utils/
├── app.tsx
├── main.tsx
└── index.css
```

## Requirements

- Node.js 18+
- npm
- a Doc Insights backend exposing the required APIs and WebSocket endpoint

## Environment configuration

Create a `.env` file in the project root with the following variables:

```env
VITE_DOC_INSIGHTS_API="https://<api-url>"
VITE_WEBSCOKET_END_POINT="wss://<websocket-url>"
```

These variables are used for:

- `VITE_DOC_INSIGHTS_API`: HTTP API base URL
- `VITE_WEBSCOKET_END_POINT`: WebSocket endpoint for chat and processing events

## Installation

```bash
npm install
```

## Run in development mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Production build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Available scripts

- `npm run dev` — starts the development environment
- `npm run build` — compiles the app for production
- `npm run preview` — serves the production build locally
- `npm run lint` — runs ESLint

## Notes

This frontend depends on the Doc Insights backend for:

- authentication
- document creation and listing
- conversation creation
- sending and retrieving messages
- processing questions about documents

If the backend is unavailable, the application will not be able to log in, upload files, or chat.

## License

This project does not currently define an explicit license.

