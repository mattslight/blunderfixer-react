import React from 'react';
import { CheckCircle, RotateCcw, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/Modal';

interface Props {
  show: boolean;
  drillResult: 'pass' | 'fail' | null;
  reason: string | null;
  onRetry: () => void;
  onNext: () => void;
}

export default function DrillResultModal({
  show,
  drillResult,
  reason,
  onRetry,
  onNext,
}: Props) {
  const navigate = useNavigate();

  const handleClose = () => navigate('/drills');

  if (!show || !drillResult) return null;

  const isPass = drillResult === 'pass';

  return (
    <Modal show={show} onClose={handleClose}>
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-700">
          {isPass ? (
            <CheckCircle className="h-8 w-8 text-green-400" />
          ) : (
            <XCircle className="h-8 w-8 text-red-400" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-white">
          {isPass ? 'Nice work!' : 'Better luck next time'}
        </h2>
        {reason && <p className="text-sm text-gray-300">{reason}</p>}
        <div className="mt-6 flex justify-center space-x-3">
          {drillResult === 'fail' && (
            <button
              onClick={onRetry}
              className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500 focus:outline-none"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry
            </button>
          )}
          <button
            onClick={onNext}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 focus:outline-none"
          >
            Next Drill
          </button>
        </div>
      </div>
    </Modal>
  );
}
