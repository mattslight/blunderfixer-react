import { useState } from 'react';

export default function PositionFeatures({ features }) {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowFeatures((f) => !f)}
        className="mt-6 rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
      >
        {showFeatures
          ? 'Hide 🧩 Position Features'
          : 'Show 🧩 Position Features'}
      </button>

      {/* collapsible panel */}
      {showFeatures && (
        <div className="mt-4 w-full max-w-lg overflow-auto rounded bg-gray-100 p-4 dark:bg-gray-800">
          <h4 className="mb-2 font-semibold">Raw Feature Dump</h4>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(features, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}
