import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';

export default function CoachChat({ fen, legalMoves }) {
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');

  async function handleCoachChatSubmit() {
    if (!userQuestion.trim()) return;
    setChatLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/coach-chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fen,
            legal_moves: legalMoves,
            past_messages: chatMessages,
            user_message: userQuestion,
          }),
        }
      );
      const data = await response.json();
      if (data.reply) {
        setChatMessages([
          ...chatMessages,
          { role: 'user', content: userQuestion },
          { role: 'assistant', content: data.reply },
        ]);
        setUserQuestion('');
      } else {
        console.error('Coach chat error:', data.error);
      }
    } catch (err) {
      console.error('Failed to chat with coach:', err);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="mt-8 w-full">
      <h3 className="mb-2 text-lg font-bold">Ask Coach a Question</h3>

      <div className="mb-4 space-y-4">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`rounded p-2 ${
              msg.role === 'user'
                ? 'bg-blue-100 text-right dark:bg-blue-700'
                : 'bg-gray-100 text-left dark:bg-gray-700'
            }`}
          >
            <div className="prose dark:prose-invert text-sm whitespace-pre-wrap">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 rounded border p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="Type your question..."
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          disabled={chatLoading}
        />
        <button
          onClick={handleCoachChatSubmit}
          disabled={!userQuestion.trim() || chatLoading}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {chatLoading ? 'Sending...' : 'Ask'}
        </button>
      </div>
    </div>
  );
}
