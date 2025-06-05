import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

import DrillList from './components/DrillList';
import { useRecentDrills } from './hooks/useRecentDrills';

import { useProfile } from '@/hooks/useProfile';

export default function RecentDrillsPage() {
  const navigate = useNavigate();
  const {
    profile: { username },
  } = useProfile();

  const { drills, loading, refreshing, error, reload } =
    useRecentDrills(username);

  return (
    <div className="p-4 pt-8 2xl:ml-12">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="inline-block py-0.5 text-xs font-semibold tracking-wider text-green-500 uppercase">
            Recent Drills
          </span>
          <button
            onClick={() => reload()}
            disabled={refreshing || loading || !username}
            className="inline-flex items-center rounded bg-gray-800 px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw
              className={`mr-2 ${refreshing && 'animate-spin'}`}
              size={14}
            />
            {refreshing ? 'Fetching…' : loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
        {error && <p className="text-red-500">{String(error)}</p>}
        <DrillList
          drills={drills}
          loading={loading}
          onStartDrill={(id) => navigate(`/drills/play/${id}`)}
        />
      </div>
    </div>
  );
}
