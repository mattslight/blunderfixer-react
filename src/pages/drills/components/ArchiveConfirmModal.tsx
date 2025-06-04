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
        Hide this drill?
      </h2>
      <p className="mb-6 text-sm text-gray-300">
        It will be archived and removed from your list.
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded bg-gray-700 px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Hide
        </button>
      </div>
    </Modal>
  );
}
