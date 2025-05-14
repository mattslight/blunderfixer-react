import { AlignJustify, GalleryThumbnails } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'card' | 'table';
  onChange: (mode: 'card' | 'table') => void;
}

export default function ListToggle({
  viewMode,
  onChange,
}: ViewModeToggleProps) {
  return (
    <div className="flex space-x-2">
      <button
        aria-label="Card view"
        onClick={() => onChange('card')}
        className={`rounded p-2 ${
          viewMode === 'card' ? 'bg-gray-700' : 'hover:bg-gray-700'
        }`}
      >
        <GalleryThumbnails
          size={20}
          className={viewMode === 'card' ? 'text-gray-400' : 'text-gray-500'}
        />
      </button>
      <button
        aria-label="List view"
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
