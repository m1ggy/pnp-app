import React, { useState } from 'react';
import { Jumbotron, Row, Col, Form, Button, Container } from 'react-bootstrap';
import uniqid from 'uniqid';
import { firestore, firebase } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  setToastShow,
  setToastContent,
  setToastHeader,
  setToastType,
} from '../../redux/toastSlice';
export default function AddNewAnnouncement() {
  const [disable, setDisable] = useState(false);
  const db = firestore.collection('announcements');
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const { currentUser } = useAuth();

  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toastReducer);

  function dispatchToast(content, show, header, type) {
    dispatch(setToastContent(content));
    dispatch(setToastHeader(header));
    dispatch(setToastShow(!show));
    dispatch(setToastType(type));
  }

  async function pushData(e) {
    e.preventDefault();

    const date = new Date();
    const tempID = uniqid();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    if (!title.replace(/\s/g, '').length) {
      return dispatchToast(
        'Please provide a title',
        toastState.show,
        'Oops..',
        'warning'
      );
    } else if (title === null) {
      return dispatchToast(
        'Please fill the title field',
        toastState.show,
        'Oops..',
        'warning'
      );
    }

    if (content === null) {
      return dispatchToast(
        'Please fill the content field',
        toastState.show,
        'Oops..',
        'warning'
      );
    } else if (!content.replace(/\s/g, '').length) {
      return dispatchToast(
        'Please fill the content field',
        toastState.show,
        'Oops..',
        'warning'
      );
    }
    setDisable(true);

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
        dispatchToast(
          'Announcement has been added.',
          toastState.show,
          'Success',
          'success'
        );
      })
      .catch((e) => {
        dispatchToast(
          'Failed to add announcement.',
          toastState.show,
          'Error',
          'danger'
        );
      });

    setTitle('');
    setContent('');

    setDisable(false);
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
          </Container>
        </Jumbotron>
      </Row>
    </Col>
  );
}
