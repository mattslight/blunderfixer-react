// src/components/drills/BotControls.tsx
export default function BotControls({
  strength,
  setStrength,
}: {
  strength: number;
  setStrength: (n: number) => void;
}) {
  return (
    <div className="flex items-center">
      <label className="flex items-center space-x-2 text-sm">
        <span className="font-bold text-stone-500">Bot&nbsp;Strength</span>
        1400
        <input
          type="range"
          min={1}
          max={20}
          value={strength}
          onChange={(e) => setStrength(Number(e.target.value))}
          className="mx-2 h-2"
        />
        3200+
      </label>
    </div>
  );
}
