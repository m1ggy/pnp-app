import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Row,
  Col,
  Form,
  Button,
  Container,
  Alert,
} from 'react-bootstrap';
import uniqid from 'uniqid';
import { firestore, firebase } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function AddNewAnnouncement() {
  const [message, setMessage] = useState();
  const [disable, setDisable] = useState(false);
  const db = firestore.collection('announcements');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { currentUser } = useAuth();

  async function pushData() {
    setMessage();

    const date = new Date();
    const tempID = uniqid();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    return await db
      .doc(tempID)
      .set(
        {
          author: currentUser.email,
          title: title,
          content: content,
          timestamp,
          dateUploaded: date.toDateString(),
          timeUploaded: date.toTimeString(),
          id: tempID,
        },
        { merge: true }
      )
      .then(() => {
        setTitle('');
        setContent('');
        setMessage({ type: 'success', msg: 'Announcement has been added!' });
      })
      .catch((e) => {
        setMessage({ type: 'danger', msg: `Error: ${e}` });
      });
  }

  useEffect(() => {
    if (disable) {
      pushData().then(() => {
        setDisable(false);
      });
    }
  }, [disable]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (e) => setDisable(true);

  return (
    <>
      <Col>
        <Row>
          <Jumbotron className='w-100'>
            <h1>Add New Announcement</h1>
          </Jumbotron>
        </Row>
        <Row>
          <Jumbotron className='w-100'>
            <Container>
              <Form>
                <Form.Group>
                  <Form.Label>Announcement Title</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Title'
                    required
                    style={{ width: '75%' }}
                    className='border'
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Announcement Content</Form.Label>
                  <Form.Control
                    as='textarea'
                    placeholder='Content'
                    required
                    rows={15}
                    style={{ resize: 'none', width: '100%' }}
                    value={content}
                    className='border'
                    onChange={(event) => {
                      setContent(event.target.value);
                    }}
                  />
                </Form.Group>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant='primary'
                    type='submit'
                    className='m-auto'
                    size='md'
                    disabled={disable}
                    onClick={!disable ? handleClick : null}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
              {message && (
                <Alert variant={message.type} className='mt-5'>
                  {message.msg}
                </Alert>
              )}
            </Container>
          </Jumbotron>
        </Row>
      </Col>
    </>
  );
}
