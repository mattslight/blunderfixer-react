import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

interface Props {
  rate: number;
  color: string;
  label: string;
}

export default function WinRateDial({ rate, color, label }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            startAngle={90}
            endAngle={450}
            data={[{ name: label, value: rate }]}
          >
            <RadialBar dataKey="value" cornerRadius={5} fill={color} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-stone-100">
          {rate}%
        </div>
      </div>
      <p className="mt-1 text-base text-stone-200 sm:text-sm">{label}</p>
    </div>
  );
}
