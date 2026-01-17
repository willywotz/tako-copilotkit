# Running Tako Research Canvas Locally

## Prerequisites

- Node.js 18+ installed
- npm or pnpm
- Valid OpenAI API key (with credits) OR Anthropic API key
- Tako API token

## Quick Start

### 1. Install Dependencies

```bash
# Install agent dependencies
cd agents
npm install --legacy-peer-deps

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Agent Server (.env)
```bash
cd agents
cp .env.example .env
```

Edit `agents/.env`:
```env
PORT=8000
USE_LOCAL_AGENT=true

# Tako API configuration
TAKO_API_BASE=http://localhost:3000/api/mcp
TAKO_API_TOKEN=your_tako_token_here

# OpenAI API key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...

# OR use Anthropic (get from https://console.anthropic.com/settings/keys)
# ANTHROPIC_API_KEY=sk-ant-...
```

#### Frontend (.env)
```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_AGENT_URL=http://localhost:8000/copilotkit
```

### 3. Start the Servers

You need TWO terminal windows:

#### Terminal 1: Agent Server
```bash
cd agents
npm run dev
```

You should see:
```
Agent server running on http://localhost:8000
Mode: Local
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v6.4.1 ready in XXX ms
➜ Local: http://localhost:5173/
```

### 4. Open the Application

Open your browser to the URL shown by Vite (usually `http://localhost:5173` or `http://localhost:3002`)

## Using the Application

1. **Enter a research question** in the input field at the top
   - Example: "How has AI adoption changed in Fortune 500 companies?"

2. **Ask the AI in the chat sidebar** (on the right):
   - "Generate a research report on this topic"
   - "Find data visualizations about renewable energy"
   - "Create a comprehensive analysis"

3. **Watch the agent work**:
   - Progress logs show in real-time
   - Data questions are generated
   - Tako charts are searched and fetched
   - Research report appears with embedded charts
   - Resources section shows all charts

## Troubleshooting

### Agent server won't start

**Problem**: Port 8000 already in use
```bash
lsof -ti:8000 | xargs kill -9
```

**Problem**: API key errors
- Verify your API key in `agents/.env`
- Check that your OpenAI account has billing enabled
- Test the key directly at https://platform.openai.com/playground

### Frontend won't connect to agent

**Problem**: CORS errors
- Make sure agent server is running on port 8000
- Check `VITE_AGENT_URL` in `frontend/.env`

**Problem**: 404 errors
- Verify the agent server is responding: `curl http://localhost:8000/copilotkit`

### No charts appearing

**Problem**: Tako API not responding
- Check `TAKO_API_TOKEN` is correct
- Verify `TAKO_API_BASE` URL is accessible
- Test the Tako API endpoints directly

### LLM errors

**Problem**: "Quota exceeded"
- Add billing to your OpenAI account
- Or switch to a different API key

**Problem**: "Model not found"
- Check you're using a valid model name
- For OpenAI: `gpt-4o`, `gpt-4`, `gpt-3.5-turbo`
- For Anthropic: `claude-3-5-sonnet-20240620`, `claude-3-opus-20240229`

## Development Tips

### Hot Reload

Both servers support hot reload:
- **Agent**: Changes to `agents/src/*.ts` files auto-reload
- **Frontend**: Changes to `frontend/src/*` files auto-reload in browser

### Viewing Logs

Agent server logs show in Terminal 1:
- API calls
- LLM responses
- Errors and warnings

Frontend logs show in browser console (F12 → Console)

### Testing the Agent Independently

Test the agent server directly with curl:

```bash
curl -X POST http://localhost:8000/copilotkit \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Generate research on AI adoption"}
    ]
  }'
```

### Changing the LLM Model

Edit `agents/src/chat.ts`:

```typescript
// For OpenAI
const model = new ChatOpenAI({
  model: "gpt-4",  // or "gpt-3.5-turbo" for cheaper/faster
  temperature: 0.7,
});

// For Anthropic
const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
  temperature: 0.7,
});
```

## Performance Tips

1. **Use gpt-3.5-turbo** for faster/cheaper responses during development
2. **Limit chart searches** by editing `agents/src/search.ts` and changing `count: 3` to `count: 2`
3. **Disable logs** by removing console.log statements

## Next Steps

Once you have it running locally, see `DEPLOY_TO_VERCEL.md` for deployment instructions.
