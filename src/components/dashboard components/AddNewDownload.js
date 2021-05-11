import React, { useState, useRef } from 'react';
import uniqid from 'uniqid';
import {
  Jumbotron,
  Col,
  Row,
  Container,
  Spinner,
  Form,
  Button,
  ProgressBar,
  Alert,
} from 'react-bootstrap';
import { storage, firestore, firebase } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import Select from 'react-select';
export default function AddNewDownload() {
  const storageRef = storage.ref();
  const db = firestore.collection('downloads');
  const { currentUser } = useAuth();
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const [file, setFile] = useState();
  const [progress, setProgress] = useState();
  const types = [
    { value: 'transparencySeal', label: 'Transparency Seal' },
    { value: 'bidsAndArchives', label: 'Bids And Archives' },
    { value: 'advisories', label: 'Advisories' },
    { value: 'generalDownloads', label: 'General Downloads' },
  ];

  function handleFile(e) {
    setFile(e.target.files[0]);
  }

  async function uploadFiles(id, file) {
    setMessage();
    const uploadTask = storageRef.child(`downloads/${id}/${id}-${file.name}`);

    await uploadTask.put(file).on(
      'state_changed',
      (taskSnapshot) => {
        setProgress(
          (100.0 * taskSnapshot.bytesTransferred) / taskSnapshot.totalBytes
        );
      },
      (e) => {
        setMessage({ type: 'danger', msg: 'Failed to upload File' });
      },
      () => {
        uploadTask
          .getDownloadURL()
          .then((url) => {
            return pushData(url, id, file);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    );
  }

  async function pushData(url, id, file) {
    const date = new Date();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    await db
      .doc(id)
      .set(
        {
          author: currentUser.email,
          id: id,
          url: url,
          type: type,
          timestamp,
          date: date.toDateString(),
          time: date.toTimeString(),
          title: file.name,
          size: file.size / 1e6,
        },
        { merge: true }
      )
      .then(() => {
        setMessage({ type: 'success', msg: 'File Uploaded successfully' });
      })
      .catch(() => {
        setMessage({
          type: 'danger',
          msg: 'An Error Occurred. File was not uploaded.',
        });
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const id = uniqid();

    setLoading(true);
    uploadFiles(id, file);
    e.target.reset();
    setLoading(false);
  }

  return (
    <>
      <Col>
        <Row>
          <Jumbotron className='w-100'>
            <h1>Add New Download</h1>
          </Jumbotron>
        </Row>
        <Row>
          <Jumbotron className='w-100' style={{ height: '500px' }}>
            <Container>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>
                    <p>Select File</p>
                  </Form.Label>
                  <Form.File onChange={(e) => handleFile(e)} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Select File Category</Form.Label>
                  <Select options={types} onChange={setType} />
                </Form.Group>

                <Container className='mt-5'>
                  <div className='m-auto mt-5'>
                    {loading ? (
                      <Spinner animation='border' />
                    ) : (
                      <Button variant='primary' type='submit'>
                        Submit
                      </Button>
                    )}
                  </div>
                  {progress && (
                    <ProgressBar
                      variant='success'
                      now={progress}
                      label={`${progress}%`}
                      className='mt-5'
                    />
                  )}
                  {message && (
                    <Alert variant={message.type} className='mt-5'>
                      {message.msg}
                    </Alert>
                  )}
                </Container>
              </Form>
            </Container>
          </Jumbotron>
        </Row>
      </Col>
    </>
  );
}
