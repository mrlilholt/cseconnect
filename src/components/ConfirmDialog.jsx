import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const ConfirmDialog = ({ open, title, description, confirmLabel = 'Confirm', onClose, onConfirm }) => (
  <Modal
    open={open}
    title={title}
    onClose={onClose}
    actions={
      <>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="from-coral to-neonpink shadow-glow"
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm text-white/60">{description}</p>
  </Modal>
);

export default ConfirmDialog;
