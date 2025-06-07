export type BackgroundPattern =
  | 'chess'
  | 'questions'
  | 'classic'
  | 'checkmate'
  | 'isometric'
  | 'tartan'
  | 'scotchgamnit'
  | 'norwaychess'
  | 'moderndefense'
  | 'boldmoves'
  | 'target'
  | 'snakebit'
  | 'goodknight'
  | 'blunderglitch'
  | 'russianschoolboy'
  | 'off';

export const PATTERN_OPTIONS: {
  value: BackgroundPattern;
  label: string;
  bgImage?: string; // <- just the image path
  sizeClass?: string;
  opacityClass?: string;
}[] = [
  {
    value: 'blunderglitch',
    label: 'Blunder Glitcher',
    bgImage: '/blunder_glitcher.png',
    sizeClass: 'bg-[length:400px]',
    opacityClass: 'opacity-[20%]',
  },
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
    opacityClass: 'opacity-[6%]',
  },
  {
    value: 'goodknight',
    label: 'Good Knight',
    bgImage: '/blunderfixer_good_knight.png',
    sizeClass: 'bg-[length:400px]',
    opacityClass: 'opacity-[10%]',
  },
  {
    value: 'moderndefense',
    label: 'Modern Defense',
    bgImage: '/blunderfixer_modern_defense.png',
    sizeClass: 'bg-[length:400px]',
    opacityClass: 'opacity-[4%]',
  },
  {
    value: 'norwaychess',
    label: 'Norway Chess',
    bgImage: '/blunderfixer_norway_chess.png',
    sizeClass: 'bg-[length:600px]',
    opacityClass: 'opacity-[10%]',
  },
  {
    value: 'chess',
    label: "Queen's Gambit",
    bgImage: '/blunderfixer_bg_chess.png',
    sizeClass: 'bg-[length:900px]',
    opacityClass: 'opacity-[10%]',
  },
  {
    value: 'russianschoolboy',
    label: 'Russian Schoolboy',
    bgImage: '/blunderfixer_russian_schoolboy.png',
    sizeClass: 'bg-[length:900px]',
    opacityClass: 'opacity-[4%]',
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
    value: 'snakebit',
    label: 'Snake-Bit',
    bgImage: '/blunderfixer_snake_bit.png',
    sizeClass: 'bg-[length:500px]',
    opacityClass: 'opacity-[8%]',
  },
  {
    value: 'target',
    label: 'Target Practice',
    bgImage: '/blunderfixer_target_practice.png',
    sizeClass: 'bg-[length:300px]',
    opacityClass: 'opacity-[2%]',
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
