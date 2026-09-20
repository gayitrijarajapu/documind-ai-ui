# DocuMind AI UI

React + Vite frontend for DocuMind AI, a document assistant for uploading PDFs,
reviewing document status, asking questions, viewing page references, generating
summaries, and reading extracted document details.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide icons

## Getting Started

Create the frontend env file:

```bash
cp .env.example .env
```

Start the FastAPI backend in a separate terminal:

```bash
cd /Users/sasitamda/Desktop/documind-ai-api
.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Start the React frontend:

```bash
cd /Users/sasitamda/Desktop/documind-ai-ui
npm install
npm run dev
```

The app expects the FastAPI backend at:

```bash
http://127.0.0.1:8000
```

You can override this with:

```bash
VITE_API_URL=http://127.0.0.1:8000
```

If Vite starts on `http://localhost:5174`, the backend already allows that origin.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
