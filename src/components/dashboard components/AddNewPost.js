import React, { useRef, useState } from 'react';
import {
  Jumbotron,
  Col,
  Row,
  Form,
  Alert,
  Container,
  Button,
} from 'react-bootstrap';
import { firestore, storage, firebase } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import uniqid from 'uniqid';
import Select from 'react-select';
import RichTextEditor from 'react-rte';

export default function AddNewPost() {
  const titleRef = useRef();
  const subtitleRef = useRef();
  const publishRef = useRef();

  const [image, setImage] = useState();
  const [type, setType] = useState();
  const [status, setStatus] = useState();
  const [showNote, setShowNote] = useState(true);
  const [content, setContent] = useState(RichTextEditor.createEmptyValue());
  const [disabled, setdisabled] = useState(false);
  const { currentUser } = useAuth();

  const special = ['<', '>'];

  const types = [
    { value: 'news', label: 'News' },
    { value: 'events', label: 'Events' },
    { value: 'others', label: 'Others' },
  ];

  const db = firestore.collection('posts');
  const storageRef = storage.ref();

  function handleImage(e) {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }
  function onChangeContent(value) {
    setContent(value);
  }

  function addData(url, tempID) {
    const date = new Date();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    db.doc(tempID)
      .set(
        {
          title: titleRef.current.value,
          subtitle: subtitleRef.current.value,
          content: content.toString('html'),
          id: tempID,
          published: publishRef.current.checked,
          author: currentUser.email,
          date: date.toDateString(),
          time: date.toTimeString(),
          timestamp,
          url: url,
          type,
        },
        { merge: true }
      )
      .then(() => {
        setStatus(true);
      })
      .catch(() => {
        setStatus(false);
      });

    if (publishRef.current.checked) {
      db.doc(tempID).set(
        {
          publishDate: date.toDateString(),
        },
        { merge: true }
      );
    }
    setdisabled(false);
    setContent(RichTextEditor.createEmptyValue());
  }

  async function pushData(e) {
    e.preventDefault();
    setdisabled(true);
    setStatus();
    ///create unique id for matching the image in storage
    const tempID = uniqid();

    const imageStorageRef = storageRef.child(`images/${tempID}`);
    ///upload image
    await imageStorageRef
      .put(image)
      .then(() => {
        imageStorageRef
          .getDownloadURL()
          .then((url) => {
            addData(url, tempID);
            e.target.reset();
          })
          .catch((e) => {
            console.log('firebase: ' + e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <>
      <Col>
        <Row>
          <Jumbotron className='w-100'>
            <h1>Add New Post</h1>
          </Jumbotron>
        </Row>

        <Row>
          <Col>
            <Jumbotron className='w-100'>
              <Container>
                <Form onSubmit={pushData}>
                  <Form.Group>
                    <Form.Label>
                      <b>Enter Title</b>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Title'
                      required
                      style={{ width: '50%' }}
                      ref={titleRef}
                      className='border'
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      <b>Enter Subtitle</b>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Subtitle'
                      required
                      style={{ width: '75%' }}
                      ref={subtitleRef}
                      className='border'
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      <b>Enter Content </b>
                    </Form.Label>
                    <RichTextEditor
                      value={content}
                      onChange={onChangeContent}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.File
                      label='Enter Banner Image'
                      required
                      accept='image/*'
                      style={{ width: 300 }}
                      onChange={handleImage}
                    />
                  </Form.Group>

                  <Form.Check
                    type='switch'
                    id='custom-switch'
                    label='Publish?'
                    ref={publishRef}
                    className='mt-5 mb-3'
                  />

                  <Form.Group>
                    <Form.Label>Select Post Category</Form.Label>
                    <Select
                      options={types}
                      onChange={setType}
                      styles={{ zIndex: 100 }}
                    />
                  </Form.Group>

                  <Container className='mt-5'>
                    <Button
                      variant='primary'
                      type='submit'
                      className='mt-5 w-25 m-auto'
                      size='md'
                      disabled={disabled}
                    >
                      Submit
                    </Button>
                  </Container>
                </Form>
                <div className='mt-5'>
                  {status ? (
                    <Alert variant='success'>
                      <Alert.Heading>Post Added!</Alert.Heading>Successfully
                      added post.
                    </Alert>
                  ) : status === false ? (
                    <Alert variant='danger'>
                      <Alert.Heading>Post was not added!</Alert.Heading>the post
                      was not added to the database. Please try again.
                    </Alert>
                  ) : status === 'undefined' ? null : null}
                </div>
              </Container>
            </Jumbotron>
          </Col>

          <Col xs lg='3'>
            <Jumbotron>
              <h3>Tips</h3>
              {showNote ? (
                <Alert
                  variant='info'
                  onClose={() => {
                    setShowNote(false);
                  }}
                  dismissible
                >
                  <Alert.Heading>#1</Alert.Heading>
                  <p>
                    You can use HTML Tags to format your content (ex.{' '}
                    <code>
                      {special[0]}b{special[1]}
                    </code>{' '}
                    for <b>bold</b>)
                  </p>
                </Alert>
              ) : (
                <Button
                  onClick={() => {
                    setShowNote(true);
                  }}
                >
                  Show Tips
                </Button>
              )}
            </Jumbotron>
          </Col>
        </Row>
      </Col>
    </>
  );
}
