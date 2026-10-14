import React, { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Add class to body to disable interactions
      document.body.classList.add('modal-open');
      console.log('Modal opened, body classes:', document.body.className);

      // Disable interactions with specific elements
      const heroSection = document.querySelector(
        'section[class*="w-full"][class*="mt-[64px]"]'
      ) as HTMLElement;
      if (heroSection) {
        heroSection.style.pointerEvents = 'none';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
      // Remove class from body
      document.body.classList.remove('modal-open');
      console.log('Modal closed, body classes:', document.body.className);

      // Restore interactions with specific elements
      const heroSection = document.querySelector(
        'section[class*="w-full"][class*="mt-[64px]"]'
      ) as HTMLElement;
      if (heroSection) {
        heroSection.style.pointerEvents = 'auto';
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-9999 pointer-events-auto animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-2xl shadow-xl max-w-4xl w-full mx-4 relative animate-in zoom-in-95 duration-300 modal-content"
        data-modal-content
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 text-3xl hover:text-gray-600 transition-colors w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 z-10 modal-close-button"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
