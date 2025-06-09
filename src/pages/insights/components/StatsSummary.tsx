import StatCard from './StatCard';
import WinRateDial from './WinRateDial';

export default function StatsSummary() {
  const stats = [
    {
      value: '123',
      label: 'Blunders Fixed',
      desc: 'Mistakes you corrected',
      color: 'text-blue-400',
    },
    {
      value: '64%',
      label: 'Tactic Accuracy',
      desc: 'Top-engine moves chosen',
      color: 'text-green-400',
    },
    {
      value: '75%',
      label: 'Winning Openings',
      desc: 'Wins from your openings',
      color: 'text-purple-400',
    },
    {
      value: '48%',
      label: 'Endgame Wins',
      desc: 'Games converted late',
      color: 'text-fuchsia-400',
    },
  ];

  return (
    <>
      {/* Mobile */}
      <section className="scrollbar-hide xs:hidden mb-4 snap-x snap-mandatory overflow-x-auto">
        <div className="flex gap-3">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              value={stat.value}
              label={stat.label}
              desc={stat.desc}
              colorClass={stat.color}
              className="min-w-[200px] shrink-0 snap-center"
            />
          ))}
        </div>
      </section>
      {/* Desktop */}
      <section className="xs:grid mb-4 hidden grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            value={stat.value}
            label={stat.label}
            desc={stat.desc}
            colorClass={stat.color}
          />
        ))}
        <div className="hidden flex-col items-center justify-center rounded bg-stone-800 p-4 sm:flex">
          <WinRateDial rate={58} color="#fbbf24" label="White Win %" />
          <p className="mt-1 text-xs text-stone-400">Wins as White</p>
        </div>
        <div className="hidden flex-col items-center justify-center rounded bg-stone-800 p-4 sm:flex">
          <WinRateDial rate={42} color="#818cf8" label="Black Win %" />
          <p className="mt-1 text-xs text-stone-400">Wins as Black</p>
        </div>
      </section>
    </>
  );
}
