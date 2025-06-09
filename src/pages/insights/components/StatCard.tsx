import { TrendingDown, TrendingUp } from 'lucide-react';

interface Props {
  value: string | number;
  label: string;
  desc: string;
  colorClass: string;
  trend?: 'up' | 'down';
  className?: string;
}

export default function StatCard({
  value,
  label,
  //desc,
  colorClass,
  trend,
  className = '',
}: Props) {
  return (
    <div
      className={`cursor-default rounded bg-stone-800 p-5 text-center select-none ${className}`}
    >
      <p
        className={`flex items-center justify-center text-2xl font-semibold ${colorClass}`}
      >
        {value}
        {trend && (
          <span className="ml-1">
            {trend === 'up' ? (
              <TrendingUp className="inline h-4 w-4" />
            ) : (
              <TrendingDown className="inline h-4 w-4" />
            )}
          </span>
        )}
      </p>
      <p className="text-base text-stone-200 sm:text-sm">{label}</p>
    </div>
  );
}
