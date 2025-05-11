import { Lightbulb } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CoachExplanation({ explanation }) {
  return (
    <div className="mt-6 rounded-r-xl border-l-4 border-green-400 bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:bg-gray-800">
      {/* Header with gradient + icon */}
      <div className="flex items-center rounded-tr-lg bg-gradient-to-r from-green-600 to-green-700 p-4">
        <Lightbulb className="mr-2 h-6 w-6 animate-pulse text-white" />
        <h3 className="text-lg font-bold text-white">Coach’s Insight</h3>
      </div>

      {/* Divider */}
      <hr className="border-green-300 dark:border-green-700" />

      {/* Content */}
      <div className="prose prose-green dark:prose-invert prose-table:border-spacing-y-2 p-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
      </div>
    </div>
  );
}
