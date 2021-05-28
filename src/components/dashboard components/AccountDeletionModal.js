import React, { useState } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
export default function AccountDeletionModal({ show, handle, data, setData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [jobDone, setJobDone] = useState(false);
  function handleDeletion() {
    console.log(data);
    setLoading(true);
    axios.post('/.netlify/functions/deleteUser', { data }).then((res) => {
      setMessage(res.data);
      setJobDone(true);
    });
    setLoading(false);
  }
  return (
    <Modal show={show} onHide={handle}>
      {data.length === 0 ? (
        <div>
          <Modal.Header closeButton>
            <Modal.Title>Select an account first</Modal.Title>
          </Modal.Header>

          <Modal.Body>Please Select an Account first.</Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handle}>
              Close
            </Button>
          </Modal.Footer>
        </div>
      ) : (
        <div>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Action</Modal.Title>
          </Modal.Header>
          {jobDone ? (
            <Modal.Body>
              {message && <Alert variant='success'>{message.message}</Alert>}
            </Modal.Body>
          ) : (
            <Modal.Body>
              {data.length > 1
                ? `Are you sure you want to delete these ${data.length} accounts?`
                : 'Are you sure you want to delete this account?'}
            </Modal.Body>
          )}
          {loading ? <Spinner animation='border' /> : null}

          <Modal.Footer>
            {jobDone ? (
              <Button
                variant='secondary'
                onClick={() => {
                  handle();
                  setJobDone(false);
                  setLoading(false);
                  setMessage();
                  setData([]);
                }}
              >
                Close
              </Button>
            ) : (
              <Button
                variant='secondary'
                onClick={handleDeletion}
                disabled={loading}
              >
                Confirm
              </Button>
            )}
          </Modal.Footer>
        </div>
      )}
    </Modal>
  );
}
