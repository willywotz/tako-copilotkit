import { useCoAgent } from "@copilotkit/react-core";
import { TakoResearchState } from "../lib/types";
import { useEffect, useRef } from "react";

export function ResearchCanvas() {
  const { state, setState } = useCoAgent<TakoResearchState>({
    name: "tako_research_agent",
    initialState: {
      research_question: "",
      data_questions: [],
      report: "",
      resources: [],
      logs: [],
    },
  });

  const reportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when report updates
  useEffect(() => {
    if (reportRef.current) {
      reportRef.current.scrollTop = reportRef.current.scrollHeight;
    }
  }, [state.report]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Research Question Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Research Question
        </label>
        <input
          type="text"
          value={state.research_question || ""}
          onChange={(e) => setState({ ...state, research_question: e.target.value })}
          placeholder="What would you like to research?"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {/* Report Section */}
      <div className="flex-1 overflow-auto p-6" ref={reportRef}>
        {state.report ? (
          <div className="prose dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: renderMarkdownWithIframes(state.report)
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium">Your research report will appear here</p>
              <p className="text-sm mt-2">
                Start by asking questions in the chat
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Data Questions Section (Debug/Info) */}
      {state.data_questions && state.data_questions.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
          <div className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            Data Questions ({state.data_questions.length})
          </div>
          <div className="space-y-1">
            {state.data_questions.map((question, idx) => (
              <div key={idx} className="text-sm text-blue-800 dark:text-blue-400">
                {idx + 1}. {question}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to render markdown with embedded iframes
function renderMarkdownWithIframes(markdown: string): string {
  // Simple markdown to HTML conversion
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br>');

  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');

  return html;
}
