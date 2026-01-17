import { StateGraph } from "@langchain/langgraph";
import { TakoResearchStateAnnotation, TakoResearchState } from "./state";
import { chat_node } from "./chat";
import { search_node } from "./search";
import { MemorySaver } from "@langchain/langgraph";

// Route function to determine next step
function shouldSearch(state: TakoResearchState): string {
  const messages = state.messages || [];
  const lastMessage = messages[messages.length - 1];

  // Check if the last message has tool calls for GenerateDataQuestions
  if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
    const hasGenerateQuestions = lastMessage.tool_calls.some(
      (tc: any) => tc.name === "GenerateDataQuestions"
    );
    if (hasGenerateQuestions && state.data_questions && state.data_questions.length > 0) {
      return "search";
    }
  }

  return "end";
}

// Create the graph
const workflow = new StateGraph(TakoResearchStateAnnotation)
  .addNode("chat", chat_node)
  .addNode("search", search_node)
  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", shouldSearch, {
    search: "search",
    end: "__end__",
  })
  .addEdge("search", "chat");

// Compile the graph without checkpointer for now
// TODO: Add proper thread_id handling for state persistence
export const graph = workflow.compile();
