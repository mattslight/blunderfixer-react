export type BackgroundPattern = 'chess' | 'questions' | 'classic' | 'off';

export const PATTERN_OPTIONS: {
  value: BackgroundPattern;
  label: string;
  bgImage?: string; // <- just the image path
  sizeClass?: string;
  opacityClass?: string;
}[] = [
  {
    value: 'chess',
    label: "Queen's Gambit",
    bgImage: '/blunderfixer_bg_chess.png',
    sizeClass: 'bg-[length:900px]',
    opacityClass: 'opacity-[4%]',
  },
  {
    value: 'questions',
    label: 'BlunderFixer Classic',
    bgImage: '/blunderfixer_bg_questionmarks.png',
    sizeClass: 'bg-[length:900px]',
    opacityClass: 'opacity-[3%]',
  },
  {
    value: 'classic',
    label: 'Why so serious?',
    bgImage: '/blunderfixer_tiled_bg.png',
    sizeClass: 'bg-[length:700px]',
    opacityClass: 'opacity-[2%]',
  },
  { value: 'off', label: 'Blank Slate (None)' },
];
