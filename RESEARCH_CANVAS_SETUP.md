# Tako Research Canvas Setup Guide

This guide explains how to set up and run the Tako Research Canvas application.

## Architecture Overview

The Tako Research Canvas is modeled after the CopilotKit research-canvas example and consists of three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (React + Vite)                │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ ResearchCanvas│  │TakoResources │  │  CopilotChat     │  │
│  │   Component   │  │  Component   │  │   (Sidebar)      │  │
│  └───────────────┘  └──────────────┘  └──────────────────┘  │
│                                                               │
│                    CopilotKit Provider                        │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         │ WebSocket/HTTP
                         │
┌────────────────────────▼──────────────────────────────────────┐
│                Agent Server (Node.js + Express)               │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         LangGraph Workflow (TypeScript)              │    │
│  │                                                       │    │
│  │  ┌──────────┐    ┌────────────┐    ┌─────────────┐  │    │
│  │  │Chat Node │───▶│Search Node │───▶│ Tako API    │  │    │
│  │  │  (LLM)   │    │(Knowledge  │    │ Integration │  │    │
│  │  └──────────┘    │  Search)   │    └─────────────┘  │    │
│  │                  └────────────┘                      │    │
│  └──────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

## Features

- **AI-Powered Research**: Generate comprehensive research reports using natural language
- **Tako Integration**: Automatically search Tako's knowledge base for relevant data visualizations
- **Intelligent Data Questions**: AI generates specific data questions from your research topic
- **Embedded Charts**: Tako chart iframes are intelligently embedded in the research draft
- **Resource Management**: View all charts with titles, descriptions, and sources
- **Real-time Progress**: See agent activity as it searches and generates content
- **Interactive Chat**: CopilotChat sidebar for conversational interaction

## Project Structure

```
tako-copilotkit/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Main.tsx        # Main layout with chat + canvas
│   │   │   ├── ResearchCanvas.tsx
│   │   │   ├── TakoResources.tsx
│   │   │   └── Progress.tsx
│   │   ├── lib/
│   │   │   └── types.ts        # Shared TypeScript types
│   │   └── main.tsx            # Entry point with CopilotKit provider
│   └── package.json
│
├── agents/                      # LangGraph agent (TypeScript)
│   ├── src/
│   │   ├── agent.ts            # Workflow graph definition
│   │   ├── state.ts            # State annotations
│   │   ├── chat.ts             # Chat node with LLM tools
│   │   ├── search.ts           # Search node for Tako API
│   │   ├── server.ts           # Express server for CopilotKit runtime
│   │   └── index.ts            # Exports
│   └── package.json
│
└── api/                         # Vercel serverless functions (existing)
    ├── knowledge_search.py
    ├── open_chart_ui.py
    └── mcp_client.py
```

## Setup Instructions

### 1. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Agent Server
```bash
cd agents
npm install
```

### 2. Configure Environment Variables

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_AGENT_URL=http://localhost:8000/copilotkit
```

#### Agent Server (.env)
```bash
cd agents
cp .env.example .env
```

Edit `agents/.env`:
```
PORT=8000
USE_LOCAL_AGENT=true

# Tako API configuration
TAKO_API_BASE=http://localhost:3000/api/mcp
TAKO_API_TOKEN=your_tako_api_token_here

# OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start the Development Servers

You'll need to run **two servers** in separate terminals:

#### Terminal 1: Agent Server
```bash
cd agents
npm run dev
```

This starts the LangGraph agent server on `http://localhost:8000`.

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

This starts the Vite dev server (usually on `http://localhost:5173`).

### 4. Using the Application

1. **Open your browser** to the Vite dev server URL (e.g., `http://localhost:5173`)

2. **Enter a research question** in the input field at the top, for example:
   - "How has AI adoption changed in Fortune 500 companies?"
   - "Compare renewable energy growth across different regions"
   - "What are the trends in remote work adoption?"

3. **Ask the AI to start research** in the chat sidebar:
   - "Generate a research report on this topic"
   - "Find data visualizations about this"
   - "Create a comprehensive analysis"

4. **Watch the magic happen**:
   - The AI generates specific data questions
   - Searches Tako for relevant charts
   - Fetches chart iframes
   - Writes a research report with embedded visualizations
   - Populates the resources section with chart metadata

## How It Works

### Workflow

1. **User Input**: You provide a research question
2. **AI Processing**: The LLM (GPT-4) analyzes your question
3. **Question Generation**: AI generates 3-5 specific data questions
4. **Tako Search**: Each question is searched in Tako's knowledge base
5. **Chart Retrieval**: Top results are fetched with iframe HTML
6. **Report Generation**: AI writes a comprehensive report with embedded charts
7. **Real-time Updates**: Progress logs show each step

### State Management

The application uses CopilotKit's `useCoAgent` hook for bidirectional state sync:

```typescript
interface TakoResearchState {
  research_question: string;     // User's research topic
  data_questions: string[];      // AI-generated search queries
  report: string;                // Generated research draft
  resources: TakoResource[];     // Tako charts with metadata
  logs: string[];                // Activity logs
}
```

### LangGraph Workflow

```
START → Chat Node (LLM)
          │
          ├─ WriteResearchQuestion tool
          │    → Sets research question
          │
          ├─ GenerateDataQuestions tool
          │    → Creates 3-5 specific questions
          │    → Triggers Search Node
          │         │
          │         ├─ Search Tako for each question
          │         ├─ Fetch top 3 results per question
          │         ├─ Get iframe HTML for each chart
          │         └─ Add to resources
          │
          └─ WriteReport tool
               → Generate markdown report
               → Embed chart iframes
               → Add resource references
               → END
```

## API Reference

### Tako API Endpoints (Existing)

These are called by the agent's search node:

#### POST `/api/mcp/knowledge_search`
```json
{
  "query": "string",
  "count": 5,
  "search_effort": "deep"
}
```

#### POST `/api/mcp/open_chart_ui`
```json
{
  "pub_id": "string",
  "dark_mode": false,
  "width": "100%",
  "height": "500px"
}
```

### CopilotKit Runtime

#### POST `/copilotkit`
The agent server exposes this endpoint for CopilotKit integration.

## Customization

### Changing the LLM

Edit `agents/src/chat.ts`:

```typescript
const model = new ChatOpenAI({
  model: "gpt-4o",  // Change to gpt-4, gpt-3.5-turbo, etc.
  temperature: 0.7,
});
```

### Adjusting Search Parameters

Edit `agents/src/search.ts`:

```typescript
const results = await searchTakoCharts(question, 3); // Change from 3 to more/fewer results
```

### Modifying the System Prompt

Edit `agents/src/chat.ts` in the `chat_node` function to customize the AI's behavior.

## Deployment

### Production Deployment Options

1. **Frontend**: Deploy to Vercel (already configured)
2. **Agent Server**: Deploy to:
   - **LangGraph Platform** (recommended)
   - Vercel serverless function (Node.js runtime)
   - Railway, Render, or any Node.js hosting

### LangGraph Platform Deployment

```bash
# Build the agent
cd agents
npm run build

# Deploy to LangGraph Platform
langgraph deploy

# Update agents/.env
USE_LOCAL_AGENT=false
LANGGRAPH_API_URL=https://your-deployment.langgraph.com
LANGGRAPH_API_KEY=your_api_key
```

## Troubleshooting

### Agent server won't start
- Check that all dependencies are installed: `npm install`
- Verify `.env` has `OPENAI_API_KEY` set
- Check port 8000 isn't already in use

### Frontend can't connect to agent
- Verify agent server is running on port 8000
- Check `VITE_AGENT_URL` in `frontend/.env`
- Look for CORS errors in browser console

### No search results
- Verify `TAKO_API_TOKEN` is correct
- Check `TAKO_API_BASE` points to the right URL
- Test API endpoints directly with curl/Postman

### Charts not displaying
- Verify `open_chart_ui` API is working
- Check browser console for iframe errors
- Ensure `dangerouslySetInnerHTML` is rendering properly

## Next Steps

- Add more sophisticated markdown rendering (use a library like `react-markdown`)
- Implement resource editing/deletion
- Add export functionality (PDF, DOCX)
- Support multiple research questions
- Add collaborative features
- Integrate more Tako tools (insights, annotations)

## Resources

- [CopilotKit Documentation](https://docs.copilotkit.ai)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Research Canvas Example](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1.x/research-canvas)
