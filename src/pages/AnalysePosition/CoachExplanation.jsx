import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';

export default function CoachExplanation({ explanation }) {
  return (
    <div className="mt-6 rounded bg-green-100 p-4 dark:bg-green-900">
      <h3 className="mb-2 text-lg font-bold">Coach's Insight</h3>
      <div className="prose dark:prose-invert prose-table:border-spacing-y-2 prose-table:border-b prose-th:border-b prose-td:border-b prose-th:border-grey-700">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
      </div>
    </div>
  );
}
