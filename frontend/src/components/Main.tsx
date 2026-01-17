import { CopilotChat } from "@copilotkit/react-ui";
import { ResearchCanvas } from "./ResearchCanvas";
import { TakoResources } from "./TakoResources";
import { Progress } from "./Progress";
import "@copilotkit/react-ui/styles.css";

export function Main() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Research Canvas */}
        <div className="flex-1 overflow-hidden">
          <ResearchCanvas />
        </div>

        {/* Progress Indicator */}
        <Progress />

        {/* Resources Section */}
        <div className="h-64 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-auto">
          <TakoResources />
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Research Assistant
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Ask questions to generate data-driven research
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <CopilotChat
            className="h-full"
            instructions="You are a research assistant that helps users create data-driven research reports using Tako charts. Guide users through the research process and help them explore data visualizations."
            labels={{
              title: "Research Assistant",
              initial: "Hello! I'm your research assistant. What would you like to research today?",
            }}
          />
        </div>
      </div>
    </div>
  );
}
