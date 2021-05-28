import React, { useState } from 'react';
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
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const { currentUser } = useAuth();

  async function pushData(e) {
    setDisable(true);
    e.preventDefault();
    setMessage();

    const date = new Date();
    const tempID = uniqid();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    if (title === '') {
      return setMessage({ msg: 'please fill the title field', type: 'danger' });
    }

    if (title === null) {
      return setMessage({ msg: 'please fill the title field', type: 'danger' });
    }

    if (content === '') {
      return setMessage({
        msg: 'please fill the content field',
        type: 'danger',
      });
    }

    await db
      .doc(tempID)
      .set(
        {
          author: currentUser.email,
          title: title,
          content,
          timestamp,
          dateUploaded: date.toDateString(),
          timeUploaded: date.toTimeString(),
          id: tempID,
        },
        { merge: true }
      )
      .then(() => {
        setMessage({ type: 'success', msg: 'Announcement has been added!' });
      })
      .catch((e) => {
        setMessage({ type: 'danger', msg: `Error: ${e}` });
      });

    setTitle('');
    setContent('');

    setDisable(false);
  }

  function onChangeContent(value) {
    setContent(value);
  }
  return (
    <Col>
      <Row>
        <Jumbotron className='w-100'>
          <h1>Add New Announcement</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          <Container>
            <Form onSubmit={pushData}>
              <Form.Group>
                <Form.Label>Announcement Title</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Title'
                  style={{ width: '75%' }}
                  className='border'
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Announcement Content</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={10}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  className='border'
                  required
                />
              </Form.Group>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant='primary'
                  type='submit'
                  className='m-auto'
                  size='md'
                  disabled={disable}
                >
                  Submit
                </Button>
              </div>
            </Form>
            {message && (
              <Alert
                variant={message.type}
                className='mt-5'
                style={{ textAlign: 'center' }}
              >
                {message.msg}
              </Alert>
            )}
          </Container>
        </Jumbotron>
      </Row>
    </Col>
  );
}
