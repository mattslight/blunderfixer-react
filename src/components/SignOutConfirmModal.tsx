import Modal from './Modal';

interface Props {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function SignOutConfirmModal({
  show,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal show={show} onClose={onCancel}>
      <h2 className="mb-4 text-lg font-semibold text-white">Sign out?</h2>
      <p className="mb-6 text-stone-200">Are you sure you want to sign out?</p>
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
          Sign out
        </button>
      </div>
    </Modal>
  );
}
