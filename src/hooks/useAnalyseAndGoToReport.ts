import { useNavigate } from 'react-router-dom';

import { useGameAnalysis } from '@/pages/games/hooks/useGameAnalysis';
import { useGameData } from '@/pages/games/hooks/useGameData';
import type { GameRecord } from '@/types';

export function useAnalyseAndGoToReport() {
  const navigate = useNavigate();
  const { saveGame, gamesMap } = useGameData();
  const { analyse, analysedIds } = useGameAnalysis(gamesMap);

  return async function analyseAndGo(game: GameRecord) {
    if (!game?.id) return;

    if (!analysedIds.has(game.id)) {
      saveGame(game);
      await analyse(game.id);
    }

    navigate(`/report/${game.id}`);
  };
}
