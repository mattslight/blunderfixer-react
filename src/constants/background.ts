export type BackgroundPattern =
  | 'chess'
  | 'questions'
  | 'classic'
  | 'checkmate'
  | 'tartan'
  | 'scotchgamnit'
  | 'moderndefense'
  | 'boldmoves'
  | 'off';

export const PATTERN_OPTIONS: {
  value: BackgroundPattern;
  label: string;
  bgImage?: string; // <- just the image path
  sizeClass?: string;
  opacityClass?: string;
}[] = [
  {
    value: 'boldmoves',
    label: 'Bold Lines',
    bgImage: '/blunderfixer_bold_moves.png',
    sizeClass: 'bg-[length:800px]',
    opacityClass: 'opacity-[4%]',
  },
  {
    value: 'checkmate',
    label: 'Checkmate!',
    bgImage: '/blunderfixer_bg_checkmate.png',
    sizeClass: 'bg-[length:400px]',
    opacityClass: 'opacity-[4%]',
  },
  {
    value: 'moderndefense',
    label: 'Modern Defense',
    bgImage: '/blunderfixer_modern_defense.png',
    sizeClass: 'bg-[length:400px]',
    opacityClass: 'opacity-[4%]',
  },
  {
    value: 'chess',
    label: "Queen's Gambit",
    bgImage: '/blunderfixer_bg_chess.png',
    sizeClass: 'bg-[length:900px]',
    opacityClass: 'opacity-[7%]',
  },
  {
    value: 'tartan',
    label: 'Scotch Game',
    bgImage: '/blunderfixer_tartan.png',
    sizeClass: 'bg-[length:400px]',
    opacityClass: 'opacity-[50%]',
  },
  {
    value: 'scotchgamnit',
    label: 'Scotch Gambit',
    bgImage: '/blunderfixer_tartan.png',
    sizeClass: 'bg-[length:200px]',
    opacityClass: 'opacity-[75%]',
  },
  {
    value: 'questions',
    label: "Where's my mind?",
    bgImage: '/blunderfixer_bg_questionmarks.png',
    sizeClass: 'bg-[length:900px]',
    opacityClass: 'opacity-[6%]',
  },
  {
    value: 'classic',
    label: 'Why so serious?',
    bgImage: '/blunderfixer_tiled_bg.png',
    sizeClass: 'bg-[length:700px]',
    opacityClass: 'opacity-[4%]',
  },

  { value: 'off', label: 'Blank Slate (None)' },
];
