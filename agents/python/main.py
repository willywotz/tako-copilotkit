"""Demo"""

import os

import uvicorn
from ag_ui_langgraph import add_langgraph_fastapi_endpoint
from copilotkit import LangGraphAGUIAgent
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()
print(f"DEBUG: Environment variables loaded")
print(f"DEBUG: OPENAI_API_KEY present: {'OPENAI_API_KEY' in os.environ}")
print(f"DEBUG: OPENAI_API_KEY value: {os.getenv('OPENAI_API_KEY', 'NOT SET')[:10] if os.getenv('OPENAI_API_KEY') else 'NOT SET'}...")
os.environ["LANGGRAPH_FASTAPI"] = "true"
from src.agent import graph  # noqa: E402

app = FastAPI()

add_langgraph_fastapi_endpoint(
    app=app,
    agent=LangGraphAGUIAgent(
        name="research_agent", description="Research agent.", graph=graph
    ),
    path="/copilotkit/agents/research_agent",
)
# add_langgraph_fastapi_endpoint(
#     app=app,
#     agent=LangGraphAGUIAgent(
#         name="research_agent_google_genai", description="Research agent.", graph=graph
#     ),
#     path="/copilotkit/agents/research_agent_google_genai",
# )


@app.get("/health")
def health():
    """Health check."""
    return {"status": "ok"}


def main():
    """Run the uvicorn server."""
    port = int(os.getenv("PORT", "2024"))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        reload_dirs=(
            ["."]
            + (
                ["../../../../sdk-python/copilotkit"]
                if os.path.exists("../../../../sdk-python/copilotkit")
                else []
            )
        ),
    )


if __name__ == "__main__":
    main()
