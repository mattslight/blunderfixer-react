// src/pages/analyse/components/PasteForm.jsx
import { useState } from 'react';

import { Button } from 'flowbite-react';

export default function PasteForm({ onSubmit }) {
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
      <Button onClick={() => onSubmit(value.trim())} disabled={!value.trim()}>
        Submit
      </Button>
    </div>
  );
}
