// src/components/drills/BotControls.tsx
export default function BotControls({
  strength,
  setStrength,
}: {
  strength: number;
  setStrength: (n: number) => void;
}) {
  return (
    <div className="flex items-center space-x-3 rounded-lg bg-gray-800 p-4">
      <label className="flex items-center space-x-2 text-sm">
        <span>Depth:</span>
        <input
          type="range"
          min={1}
          max={20}
          value={strength}
          onChange={(e) => setStrength(Number(e.target.value))}
          className="h-2"
        />
        <span className="w-6 text-right">{strength}</span>
      </label>
    </div>
  );
}
