// src/pages/analyse/components/PasteForm.jsx
import { useState } from 'react';

export default function PasteForm() {
  const [value, setValue] = useState('');

  return (
    <div className="space-y-4">
      <textarea
        rows={6}
        className="w-full rounded border p-2 dark:bg-gray-800 dark:text-white"
        placeholder="Paste a FEN or full PGN here…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
