# Tako Research Canvas

AI-powered research assistant that generates data-driven research reports using Tako charts and visualizations.

![LangGraph](https://img.shields.io/badge/LangGraph-Enabled-blue) ![CopilotKit](https://img.shields.io/badge/CopilotKit-v1.50-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Overview

Tako Research Canvas is a full-stack AI application that helps users create comprehensive research reports by:
1. Generating specific data questions from research topics
2. Searching Tako's knowledge base for relevant charts
3. Creating research reports with embedded visualizations
4. Providing real-time progress tracking

Built with:
- **Frontend**: React + Vite + CopilotKit + TailwindCSS
- **Backend**: LangGraph + Express + OpenAI (GPT-4)
- **Integration**: Tako API for data visualizations

## Features

✨ **AI-Powered Research**
- Natural language research questions
- Automatic data question generation
- Intelligent chart search and embedding

📊 **Tako Integration**
- Knowledge search across Tako database
- Interactive chart iframes
- Chart metadata and source tracking

⚡ **Real-Time Updates**
- Live progress logs
- Bidirectional state sync
- Streaming responses

💬 **Interactive Chat**
- CopilotKit chat sidebar
- Conversational interface
- Context-aware suggestions

## Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key (with credits)
- Tako API token

### Installation & Running

```bash
# Clone the repository
git clone <your-repo-url>
cd tako-copilotkit

# Run the startup script
./start.sh
```

That's it! The script will:
- Install all dependencies
- Set up environment files
- Start both servers
- Open your browser automatically

### Manual Setup

If you prefer manual control, see [RUN_LOCALLY.md](./RUN_LOCALLY.md) for detailed instructions.

## Project Structure

```
tako-copilotkit/
├── agents/                  # LangGraph backend agent
│   ├── src/
│   │   ├── agent.ts        # Workflow graph
│   │   ├── chat.ts         # LLM chat node
│   │   ├── search.ts       # Tako API integration
│   │   ├── state.ts        # State management
│   │   └── server.ts       # Express server
│   └── package.json
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Main.tsx           # Main layout
│   │   │   ├── ResearchCanvas.tsx # Research UI
│   │   │   ├── TakoResources.tsx  # Chart display
│   │   │   └── Progress.tsx       # Activity logs
│   │   ├── lib/
│   │   │   └── types.ts           # TypeScript types
│   │   └── main.tsx              # Entry point
│   └── package.json
│
└── api/                    # Existing Tako API functions
    ├── knowledge_search.py
    ├── open_chart_ui.py
    └── mcp_client.py
```

## Usage

1. **Enter a Research Question**
   ```
   "How has AI adoption changed in Fortune 500 companies?"
   ```

2. **Ask the AI to Generate a Report**
   - Type in the chat: "Generate a research report on this topic"
   - Or: "Find data visualizations about this"

3. **View Results**
   - Real-time progress in the activity log
   - Research report with embedded charts
   - Resource cards with chart metadata

## Configuration

### Agent Server (.env)
```env
PORT=8000
USE_LOCAL_AGENT=true
OPENAI_API_KEY=sk-...
TAKO_API_TOKEN=...
TAKO_API_BASE=http://localhost:3000/api/mcp
```

### Frontend (.env)
```env
VITE_AGENT_URL=http://localhost:8000/copilotkit
```

## Deployment

See [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md) for comprehensive deployment instructions including:
- Vercel deployment (full stack)
- Railway + Vercel (recommended for production)
- LangGraph Cloud (most scalable)

## Documentation

- [RUN_LOCALLY.md](./RUN_LOCALLY.md) - Local development guide
- [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md) - Production deployment
- [RESEARCH_CANVAS_SETUP.md](./RESEARCH_CANVAS_SETUP.md) - Detailed architecture

## Architecture

```
User Browser
    ↓
React Frontend (CopilotKit)
    ↓
Agent Server (Express + LangGraph)
    ↓
┌─────────────┬─────────────┐
│  OpenAI     │  Tako API   │
│  (GPT-4)    │  (Charts)   │
└─────────────┴─────────────┘
```

### Workflow

1. User provides research question
2. LLM generates data questions
3. Agent searches Tako for each question
4. Charts are fetched with iframe HTML
5. LLM writes comprehensive report
6. Report + charts displayed to user

## Development

### Start Development Servers

```bash
# Terminal 1: Agent server
cd agents
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Build for Production

```bash
# Build agent
cd agents
npm run build

# Build frontend
cd frontend
npm run build
```

### Type Checking

```bash
# Check agent types
cd agents
npm run type-check

# Check frontend types
cd frontend
npm run type-check
```

## Troubleshooting

See [RUN_LOCALLY.md](./RUN_LOCALLY.md) for detailed troubleshooting.

Common issues:
- **Port in use**: `lsof -ti:8000 | xargs kill -9`
- **API quota**: Add billing at OpenAI
- **No charts**: Check Tako API token

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT

## Acknowledgments

- Modeled after [CopilotKit Research Canvas](https://github.com/CopilotKit/CopilotKit/tree/main/examples/v1.x/research-canvas)
- Built with [LangGraph](https://github.com/langchain-ai/langgraph)
- Powered by [CopilotKit](https://github.com/CopilotKit/CopilotKit)
- Data from [Tako](https://tako.com)
