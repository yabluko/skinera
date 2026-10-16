'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useModal } from './ModalContext';

interface ModalButtonProps {
  buttonText: React.ReactNode;
  modalContent: React.ReactNode;
  className?: string;
  /** Skip default button styles; use `className` only */
  unstyled?: boolean;
}

const ModalButton: React.FC<ModalButtonProps> = ({
  buttonText,
  modalContent,
  className,
  unstyled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setIsModalOpen: setGlobalModalOpen } = useModal();

  const openModal = () => {
    setIsModalOpen(true);
    setGlobalModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setGlobalModalOpen(false);
  };

  return (
    <>
      <button
        className={
          unstyled
            ? className
            : `bg-brand-600 text-white px-6 py-3 rounded-full hover:bg-brand-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                className || ''
              }`
        }
        onClick={openModal}
      >
        {buttonText}
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </>
  );
};

export default ModalButton;
