import { useMemo } from 'react';

import AdvancedStats from './components/AdvancedStats';
import DrillSection from './components/DrillSection';
import GameSection from './components/GameSection';
import HeroSection from './components/HeroSection';
import StatsSummary from './components/StatsSummary';

import { greetings } from '@/const/greetings';
import { useAnalyseAndGoToReport } from '@/hooks/useAnalyseAndGoToReport';
import { useProfile } from '@/hooks/useProfile';
import { parseChessComGame } from '@/lib/chessComParser';
import { useDrills } from '@/pages/drills/hooks/useDrills';
import { buildDrillFilters } from '@/pages/drills/utils/filters';
import { useRecentGames } from '@/pages/games/hooks/useRecentGames';

export default function HomeScreen() {
  const {
    profile: { username },
  } = useProfile();

  const filters = buildDrillFilters(
    username,
    {
      phaseFilter: 'all',
      excludeWins: false,
      includeArchived: false,
      includeMastered: false,
      rangeIdx: [0, 5],
    },
    undefined
  );

  const { drills, loading: loadingDrills } = useDrills(filters);

  const { games: rawGames, loading: loadingGames } = useRecentGames(
    username,
    3
  );

  const analyseAndGo = useAnalyseAndGoToReport();

  const nextDrillId = drills[0]?.id;

  const games = Array.isArray(rawGames) ? rawGames.map(parseChessComGame) : [];

  const randomGreeting = useMemo(() => {
    return greetings[Math.floor(Math.random() * greetings.length)];
  }, []);

  return (
    <>
      <div className="p-4 px-8 pt-16 2xl:ml-12">
        <div className="mx-auto max-w-3xl space-y-3">
          <HeroSection
            username={username}
            nextDrillId={nextDrillId}
            greeting={randomGreeting}
          />
          <StatsSummary />
          <AdvancedStats />
          <DrillSection drills={drills} loading={loadingDrills} />
          <GameSection
            games={games}
            username={username}
            loading={loadingGames}
            onAnalyse={analyseAndGo}
          />
        </div>
      </div>
    </>
  );
}
