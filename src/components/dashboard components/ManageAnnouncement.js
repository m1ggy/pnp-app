import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Row,
  Col,
  Button,
  ButtonGroup,
  Spinner,
  Container,
  Modal,
} from 'react-bootstrap';

import { firestore } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function ManageAnnouncement() {
  const [announcement, setAnnouncement] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [message, setMessage] = useState();
  const db = firestore.collection('announcements');
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [messageShowModal, setMessageShowModal] = useState(false);

  function handleCloseModal() {
    setShowModal(false);
  }

  async function getData() {
    setLoading(true);
    let tempArray = [];

    await db.get().then((snap) => {
      if (snap.empty) {
        return setAnnouncement([]);
      }

      snap.forEach((doc) => {
        tempArray.push(doc.data());
      });
      console.log(tempArray);
      setAnnouncement(tempArray);
    });

    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  function deleteAnnouncement(item) {
    setShowModal(false);
    db.doc(item.id)
      .delete()
      .then(() => {
        setMessage({
          type: 'primary',
          msg: 'Successfully deleted announcement',
        });
      })
      .catch(() => {
        setMessage({ type: 'danger', msg: 'Failed to delete announcement' });
      });
    setMessageShowModal(true);
  }

  function DeleteModal() {
    if (selectedItem == null || typeof selectedItem == undefined) {
      return null;
    }

    return (
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <h3>Are you sure?</h3>
        </Modal.Header>
        <Modal.Body>Do you want to delete {selectedItem.title}?</Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              variant='primary'
              size='sm'
              className='w-75 m-3'
              onClick={() => {
                deleteAnnouncement(selectedItem);
              }}
            >
              Yes
            </Button>
            <Button
              variant='danger'
              size='sm'
              className='w-75 m-3'
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }

  function MessageModal() {
    if (message == null || typeof message == undefined) {
      return null;
    }

    return (
      <Modal
        show={messageShowModal}
        onHide={() => {
          setMessageShowModal(false);
        }}
      >
        <Modal.Header>
          {message.type === 'primary' ? <h3>Success!</h3> : <h3>Failed!</h3>}
        </Modal.Header>
        <Modal.Body>
          <p>{message.msg}</p>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              variant='primary'
              size='sm'
              className='w-75 m-3'
              onClick={() => {
                setMessageShowModal(false);
                getData();
              }}
            >
              Close
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }

  function RenderAnnouncements() {
    if (announcement.length === 0)
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p>No Announcements</p>
        </div>
      );

    let filtered = announcement.filter(
      (item) => item.author === currentUser.email
    );

    return filtered.map((item) => {
      return (
        <Row key={item.id} className='border w-100 p-3'>
          <Col>
            <Row className='w-100'>
              <h3>{item.title}</h3>
            </Row>
            <Row className='w-100'>
              <p style={{ fontSize: 14 }}>{item.dateUploaded}</p>
            </Row>
          </Col>
          <Col lg={3}>
            <Row>
              <Button
                variant='danger'
                size='sm'
                className='m-auto'
                onClick={() => {
                  setSelectedItem(item);
                  setShowModal(true);
                }}
              >
                Delete
              </Button>
            </Row>
          </Col>
        </Row>
      );
    });
  }
  return (
    <>
      <Col>
        <Row>
          <Jumbotron className='w-100'>
            <h1>Manage Announcement</h1>
          </Jumbotron>
        </Row>
        <Row>
          <Jumbotron className='w-100'>
            <Container>
              {loading ? (
                <Spinner animation='border m-auto' />
              ) : (
                <RenderAnnouncements />
              )}
              <DeleteModal />
              <MessageModal />
            </Container>
          </Jumbotron>
        </Row>
      </Col>
    </>
  );
}
