import React, { useRef, useState } from 'react';
import {
  Jumbotron,
  Col,
  Row,
  Form,
  Container,
  Button,
  Spinner,
} from 'react-bootstrap';
import { firestore, storage, firebase } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import uniqid from 'uniqid';
import Select from 'react-select';
import RichTextEditor from 'react-rte';
import { useDispatch, useSelector } from 'react-redux';
import {
  setToastShow,
  setToastContent,
  setToastHeader,
  setToastType,
} from '../../redux/toastSlice';

export default function AddNewPost() {
  const titleRef = useRef();
  const subtitleRef = useRef();
  const publishRef = useRef();

  const [image, setImage] = useState();
  const [type, setType] = useState();
  const [content, setContent] = useState(RichTextEditor.createEmptyValue());
  const [disabled, setdisabled] = useState(false);
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toastReducer);

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
  function dispatchToast(content, show, header, type) {
    dispatch(setToastContent(content));
    dispatch(setToastHeader(header));
    dispatch(setToastShow(!show));
    dispatch(setToastType(type));
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
        dispatchToast(
          'Successfully added post.',
          toastState.show,
          'Success',
          'success'
        );
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

    if (type == null) {
      return dispatchToast(
        'Please select category.',
        toastState.show,
        'Oops...',
        'danger'
      );
    } else if (content.toString('html') === '<p><br></p>') {
      return dispatchToast(
        'Content is Empty. Please provide content for the post.',
        toastState.show,
        'Oops...',
        'danger'
      );
    }
    setLoading(true);
    setdisabled(true);

    ///create unique id for matching the image in storage
    const tempID = uniqid();

    const imageStorageRef = storageRef.child(`images/${tempID}`);
    ///upload image
    await imageStorageRef.put(image).then(() => {
      imageStorageRef
        .getDownloadURL()
        .then((url) => {
          addData(url, tempID);
          e.target.reset();
        })
        .catch(() => {
          dispatchToast(
            'Failed to upload post.',
            toastState.show,
            'Something went wrong..',
            'danger'
          );
          setdisabled(false);
        });
    });

    setType(null);
    setLoading(false);
  }
  return (
    <React.Fragment>
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
                      value={type}
                    />
                  </Form.Group>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant='primary'
                      type='submit'
                      className='mt-5 w-25 m-auto'
                      size='md'
                      disabled={disabled}
                    >
                      {loading ? (
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Spinner
                            animation='border'
                            variant='light'
                            size='sm'
                          />
                        </div>
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  </div>
                </Form>
                <div className='mt-5'></div>
              </Container>
            </Jumbotron>
          </Col>
        </Row>
      </Col>
    </React.Fragment>
  );
}
