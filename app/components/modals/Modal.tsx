// Import React and useState hook from 'react'
import React, { ReactElement, useState } from 'react';
// Importing React portal from 'react-dom'
import ReactDOM from 'react-dom';

import TextInput from '@/app/components/inputs/TextInput';
import { JsxElement } from 'typescript';

interface ModalPropsWithChildren {
  showModal: boolean;
  onClose: () => void;
  children: ReactElement;
}

const Modal: React.FC<ModalPropsWithChildren> = ({ showModal, onClose, children }) => {
  // Don't render the modal if showModal is false
  if (!showModal) return null;

  // Use React portal to render the modal as a child of 'body'
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {children}
      </div>
    </div>,
    document.body // Attach the modal to the body element
  );
};

export default Modal;