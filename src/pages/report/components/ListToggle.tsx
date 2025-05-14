// src/components/ListToggle.tsx
import { AlignJustify, Layers2 } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'stack' | 'table';
  onChange: (mode: 'stack' | 'table') => void;
}

export default function ListToggle({
  viewMode,
  onChange,
}: ViewModeToggleProps) {
  return (
    <div className="flex space-x-2">
      <button
        aria-label="Stack view"
        onClick={() => onChange('stack')}
        className={`rounded p-2 ${
          viewMode === 'stack' ? 'bg-gray-700' : 'hover:bg-gray-700'
        }`}
      >
        <Layers2
          size={20}
          className={viewMode === 'stack' ? 'text-gray-400' : 'text-gray-500'}
        />
      </button>
      <button
        aria-label="Table view"
        onClick={() => onChange('table')}
        className={`rounded p-2 ${
          viewMode === 'table' ? 'bg-gray-700' : 'hover:bg-gray-700'
        }`}
      >
        <AlignJustify
          size={20}
          className={viewMode === 'table' ? 'text-gray-400' : 'text-gray-500'}
        />
      </button>
    </div>
  );
}
