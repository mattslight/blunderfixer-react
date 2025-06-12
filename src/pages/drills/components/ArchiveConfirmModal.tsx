import Modal from '@/components/Modal';

interface Props {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ArchiveConfirmModal({
  show,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal show={show} onClose={onCancel}>
      <h2 className="mb-4 text-lg font-semibold text-white">
        Archive this drill?
      </h2>
      <p className="text-md mb-6 text-stone-200">
        This drill will be removed from your active list.
      </p>
      <p className="mb-6 text-sm text-stone-400">
        Drills are automatically removed from your active list once you pass
        them 5 times in a row.
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded bg-stone-700 px-4 py-2 text-sm text-stone-200 hover:bg-stone-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Archive
        </button>
      </div>
    </Modal>
  );
}
