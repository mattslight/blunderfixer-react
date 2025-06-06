import { useEffect, useRef, useState } from 'react';

interface TabsProps {
  labels: string[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

export default function Tabs({
  labels,
  activeIndex,
  onChange,
  className = '',
}: TabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const current = tabRefs.current[activeIndex];
    if (current) {
      setUnderlineStyle({
        left: current.offsetLeft,
        width: current.offsetWidth,
      });
    }
  }, [activeIndex]);

  return (
    <div
      className={`relative border-b border-gray-700 text-sm text-gray-400 ${className}`.trim()}
    >
      <div className="flex space-x-8">
        {labels.map((label, idx) => (
          <button
            key={label}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            onClick={() => onChange(idx)}
            className={`pb-3 tracking-wide transition-colors ${
              activeIndex === idx ? 'text-white' : 'hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <span
        className="absolute bottom-0 block h-0.5 bg-blue-500 transition-all duration-300"
        style={underlineStyle}
      />
    </div>
  );
}
