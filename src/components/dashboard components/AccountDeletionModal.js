import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import SpinnerPlaceholder from '../SpinnerPlaceholder';
export default function AccountDeletionModal({ show, handle, data, setData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [jobDone, setJobDone] = useState(false);
  function handleDeletion() {
    setLoading(true);
    axios.post('/.netlify/functions/deleteUser', { data }).then((res) => {
      setMessage(res.data);
      setJobDone(true);
      setLoading(false);
    });
  }
  return (
    <Modal show={show} onHide={handle}>
      {loading ? (
        <div>
          <Modal.Header>
            <Modal.Title>Deleting ...</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <SpinnerPlaceholder />
          </Modal.Body>
        </div>
      ) : data.length === 0 ? (
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
          {loading ? (
            <Spinner animation='border' />
          ) : jobDone ? (
            <Modal.Body>{message && <p>{message.message}!</p>}</Modal.Body>
          ) : (
            <Modal.Body>
              {data.length > 1
                ? `Are you sure you want to delete these ${data.length} accounts?`
                : 'Are you sure you want to delete this account?'}
            </Modal.Body>
          )}

          <Modal.Footer>
            {jobDone ? (
              <Button
                variant='secondary'
                onClick={() => {
                  handle();
                  setJobDone(false);
                  setMessage();
                  setData([]);
                }}
              >
                Close
              </Button>
            ) : (
              <Button
                variant='danger'
                onClick={handleDeletion}
                disabled={loading}
                type='submit'
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
