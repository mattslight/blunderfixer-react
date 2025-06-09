interface Props {
  value: string | number;
  label: string;
  desc: string;
  colorClass: string;
  className?: string;
}

export default function StatCard({
  value,
  label,
  desc,
  colorClass,
  className = '',
}: Props) {
  return (
    <div className={`rounded bg-stone-800 p-4 text-center ${className}`}>
      <p className={`text-2xl font-semibold ${colorClass}`}>{value}</p>
      <p className="text-base text-stone-200 sm:text-sm">{label}</p>
      <p className="mt-1 text-xs text-stone-400">{desc}</p>
    </div>
  );
}
