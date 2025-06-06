import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  show: boolean;
  onClose(): void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  show,
  onClose,
  children,
  className = '',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show, onClose]);

  useEffect(() => {
    if (!show) return;
    const onClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [show, onClose]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', show);
    return () => document.body.classList.remove('overflow-hidden');
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-md">
      <div
        ref={modalRef}
        className={`relative w-full max-w-md rounded-xl border border-stone-700 bg-black/80 p-6 shadow-xl ${className}`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-stone-400 hover:text-white"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
