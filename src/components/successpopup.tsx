import React from "react";

interface ModalProps {
  isOpen: boolean;
  message: string | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-[350px] p-6 text-center rounded shadow-lg">
        <p className="text-xl text-green-600 ">{message}</p>
        <button
          onClick={onClose}
          className="mt-8 bg-neutral-900 w-1/2 text-white px-4 py-2 rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
