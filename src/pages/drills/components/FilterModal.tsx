import React from 'react';

import Modal from '@/components/Modal';

interface Props {
  show: boolean;
  onClose(): void;
  excludeWins: boolean;
  setExcludeWins: (v: boolean) => void;
  includeArchived: boolean;
  setIncludeArchived: (v: boolean) => void;
  includeMastered: boolean;
  setIncludeMastered: (v: boolean) => void;
  ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }>;
}

export default function FilterModal({
  show,
  onClose,
  excludeWins,
  setExcludeWins,
  includeArchived,
  setIncludeArchived,
  includeMastered,
  setIncludeMastered,
  ToggleSwitch,
}: Props) {
  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="mb-4 text-lg font-semibold text-white">Filters</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">
            Show drills from games won
          </span>
          <ToggleSwitch
            checked={!excludeWins}
            onChange={() => setExcludeWins(!excludeWins)}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Show archived drills</span>
          <ToggleSwitch
            checked={includeArchived}
            onChange={() => setIncludeArchived(!includeArchived)}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">
            Show drills with 5 wins in a row
          </span>
          <ToggleSwitch
            checked={includeMastered}
            onChange={() => setIncludeMastered(!includeMastered)}
          />
        </div>
      </div>
    </Modal>
  );
}
