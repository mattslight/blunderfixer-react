import React, { useEffect, useRef, useState } from 'react';

interface TabItem {
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  labels: TabItem[];
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
      className={`relative rounded-t-xl border-b border-stone-700 bg-black/50 px-3 pt-3 text-sm text-stone-400 backdrop-blur-md ${className}`.trim()}
    >
      <div className="flex space-x-8">
        {labels.map(({ label, icon }, idx) => (
          <button
            key={label}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            onClick={() => onChange(idx)}
            className={`flex items-center gap-1 pb-3 tracking-wide transition-colors ${
              activeIndex === idx ? 'text-white' : 'hover:text-stone-300'
            }`}
          >
            {icon && <span className="mr-0.5 h-4 w-4">{icon}</span>}
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
