export type BackgroundPattern = 'chess' | 'questions' | 'classic' | 'off';

export const PATTERN_OPTIONS: { value: BackgroundPattern; label: string; class: string }[] = [
  { value: 'chess', label: "Queen's Gambit", class: "bg-[url('/blunderfixer_bg_chess.png')] bg-[length:900px] bg-repeat opacity-[3%]" },
  { value: 'questions', label: 'Why so serious?', class: "bg-[url('/blunderfixer_bg_questionmarks.png')] bg-[length:900px] bg-repeat opacity-[3%]" },
  { value: 'classic', label: 'BlunderFixer Classic', class: "bg-[url('/blunderfixer_tiled_bg.png')] bg-[length:700px] bg-repeat opacity-[2%]" },
  { value: 'off', label: 'Off (Blank Slate)', class: '' },
];
