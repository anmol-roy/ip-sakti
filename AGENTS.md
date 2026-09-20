<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Frontend-Backend Integration

## Backend Setup
The Python FastAPI backend must be running before starting the frontend:

```bash
cd server
.venv/Scripts/python.exe run_server.py
```

The backend runs on `http://127.0.0.1:8000` and provides the following endpoints:
- `POST /ask` - Unified routed Q&A
- `POST /analyze-formulation` - Formulation classification and ABS compliance
- `POST /query` - Legal Q&A with citations
- `POST /analyze-invention` - Invention analysis
- `POST /patentability-check` - Patentability analysis
- `POST /multilingual-query` - Multilingual Q&A

## Frontend Configuration
Create `client/.env.local` with:
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

## API Client
The frontend uses a centralized API client at `lib/api-client.ts` that:
- Provides TypeScript interfaces matching backend Pydantic models
- Handles HTTP requests to the backend
- Manages error handling and response parsing
- Exports a singleton `apiClient` instance

## Integration Points
- **Ask Page** (`/ask/[chatId]`) → `POST /ask` endpoint
- **Analysis Page** (`/analysis`) → `POST /analyze-formulation` endpoint

## Development Workflow
1. Start backend server first
2. Configure frontend environment variables
3. Start frontend development server
4. Test integration through the UI

## Troubleshooting
- If you see "Network error: Unable to connect to the backend server", verify the backend is running on port 8000
- Check that `NEXT_PUBLIC_API_BASE_URL` is set correctly in `.env.local`
- Restart the frontend dev server after changing environment variables

See `FRONTEND_BACKEND_SETUP.md` for detailed setup instructions.
