interface DictionaryEntryProps {
  term: string;
  pos: string;
  definition: string;
  colorClass?: string; // optional override for text color
}

export function DictionaryEntry({
  term,
  pos,
  definition,
  colorClass = 'text-stone-300',
}: DictionaryEntryProps) {
  return (
    <span className="opacity-80">
      <span className={`font-semibold ${colorClass}`}>{term}</span>{' '}
      <em>({pos})</em> – {definition}
    </span>
  );
}
