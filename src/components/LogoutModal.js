import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const LogoutModal = React.memo(({ toggleModal, showModal, handleLogout }) => {
  return (
    <Modal
      show={showModal}
      onHide={() => {
        toggleModal();
      }}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Action</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to log out?</Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={handleLogout}>
          Log out
        </Button>
        <Button
          variant='primary'
          onClick={() => {
            toggleModal();
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default LogoutModal;
