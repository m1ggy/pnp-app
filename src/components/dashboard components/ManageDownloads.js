import React, { useEffect, useState } from 'react';
import {
  Jumbotron,
  Col,
  Row,
  Container,
  Spinner,
  Button,
  Modal,
  ButtonGroup,
} from 'react-bootstrap';
import { firestore, storage } from '../../firebase/firebase';

export default function ManageDownloads() {
  const db = firestore.collection('downloads');
  const storageRef = storage.ref('downloads');

  const [loading, setLoading] = useState(false);
  const [downloads, setDownloads] = useState();
  const [selectedDownload, setSelectedDownload] = useState();
  const [message, setMessage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [messageShowModal, setMessageShowModal] = useState(false);

  async function getDownloads() {
    setLoading(true);
    await db.get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        setDownloads();
        return;
      }
      let tempArray = [];
      querySnapshot.forEach((doc) => {
        tempArray.push({ id: doc.data().type.value, data: doc.data() });
      });
      console.log(tempArray);
      setDownloads(tempArray);
    });
    setLoading(false);
  }

  useEffect(() => {
    getDownloads();
  }, []);

  async function deleteDownload(item) {
    handleCloseModal();

    const deleteTask = storageRef.child(
      `${item.data.id}/${item.data.id}-${item.data.name}`
    );

    await deleteTask
      .delete()
      .then(() => {
        setMessage({
          ...message,
          type: 'primary',
          msg2: 'Successfully deleted download file in storage',
        });
      })
      .catch(() => {
        setMessage({
          ...message,
          type: 'danger',
          msg2: 'Failed to delete download file in storage',
        });
      });

    await db
      .doc(item.data.id)
      .delete()
      .then(() => {
        setMessage({
          ...message,
          type: 'primary',
          msg: 'Successfully deleted download file in database',
        });
      })
      .catch(() => {
        setMessage({
          ...message,
          type: 'danger',
          msg: 'Failed to delete download file in database',
        });
      });

    setSelectedDownload();
    getDownloads();
    setMessageShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  function DeleteModal() {
    if (selectedDownload === null || typeof selectedDownload === 'undefined') {
      return null;
    }

    return (
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <h3>Are you sure?</h3>
        </Modal.Header>
        <Modal.Body>
          Do you want to delete {selectedDownload.data.name}?
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              variant='primary'
              size='sm'
              className='w-75 m-3'
              onClick={() => {
                deleteDownload(selectedDownload);
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
    if (message === null || typeof message === 'undefined') {
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
          <p>{message.msg2}</p>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              variant='primary'
              size='sm'
              className='w-75 m-3'
              onClick={() => {
                setMessageShowModal(false);
              }}
            >
              Close
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }

  function RenderDownloads() {
    let types = [
      { type: 'advisories', label: 'Advisory' },
      { type: 'bidsAndArchives', label: 'Bids and Archives' },
      { type: 'generalDownloads', label: 'General Downloads' },
      { type: 'transparencySeal', label: 'Transparency Seal' },
    ];

    if (downloads.length === 0) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p>You have no Downloads.</p>
        </div>
      );
    }

    return types.map((type, index) => {
      let filtered = downloads.filter((item) => {
        return item.id == type.type;
      });
      return (
        <Container key={type.type + index} className='border p-5'>
          <h3>{type.label}</h3>
          <RenderEachDownload data={filtered} label={type.label} />
        </Container>
      );
    });
  }

  function RenderEachDownload({ data, label }) {
    if (data == null || typeof data == undefined) {
      return <p>No Items inside</p>;
    } else if (data.length < 1) {
      return <p>{label} is empty.</p>;
    }
    return data.map((item, index) => {
      return (
        <Container key={item.id + index} className='p-3 border'>
          <Row>
            <Col lg={10}>
              <p style={{ fontWeight: 'bold', fontSize: 16 }}>
                {item.data.name}
              </p>
              <p style={{ fontSize: 13 }}>{item.data.size} MB</p>
              {/* <p style={{fontSize:13}}>Date Uploaded: {item.data.date}</p> */}
              <p style={{ fontSize: 13 }}>Time Uploaded: {item.data.time}</p>
              <a href={item.data.url}>Link to File</a>
            </Col>

            <Col lg={2}>
              <Button
                variant='danger'
                size='sm'
                className='w-75 m-3'
                onClick={() => {
                  setShowModal(true);
                  setSelectedDownload(item);
                }}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Container>
      );
    });
  }

  return (
    <>
      <Col>
        <Row>
          <Jumbotron className='w-100'>
            <h1>Manage Downloads</h1>
          </Jumbotron>
        </Row>
        <Row></Row>
        <Row>
          <Jumbotron className='w-100'>
            <Container>
              <div className='m-auto'>
                {loading ? <Spinner animation='border' /> : null}
                {downloads ? (
                  <RenderDownloads />
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p>You have no Downloads.</p>
                  </div>
                )}
                <DeleteModal />
                <MessageModal />
              </div>
            </Container>
          </Jumbotron>
        </Row>
      </Col>
    </>
  );
}
