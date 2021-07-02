import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Row,
  Col,
  Container,
  Button,
  Form,
  Jumbotron,
  Spinner,
} from 'react-bootstrap';
import RichTextEditor from 'react-rte';
import { getDataFromDocument } from '../../utils/firebaseUtils';
import { storage, firestore } from '../../firebase/firebase';
import Select from 'react-select';
import { types } from '../../dashboard utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  setToastShow,
  setToastContent,
  setToastHeader,
  setToastType,
} from '../../redux/toastSlice';

export default function EditPost() {
  const storageRef = storage.ref('images');
  const db = firestore.collection('posts');

  const [disabled, setdisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const { id } = useParams();

  const [content, setContent] = useState(RichTextEditor.createEmptyValue());
  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState();
  const [image, setImage] = useState();
  const dispatch = useDispatch();
  const toastState = useSelector((state) => state.toastReducer);

  useEffect(() => {
    getDataFromDocument('posts', id, (res) => {
      setTitle(res.title);
      setSubtitle(res.subtitle);
      setContent(RichTextEditor.createValueFromString(res.content, 'html'));
      setType(res.type);
    });
  }, [id]);

  function handleImage(e) {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  function dispatchToast(content, show, header, type) {
    dispatch(setToastContent(content));
    dispatch(setToastHeader(header));
    dispatch(setToastShow(!show));
    dispatch(setToastType(type));
  }

  async function editPost(e) {
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

    await db.doc(id).set(
      {
        title: title,
        subtitle: subtitle,
        content: content.toString('html'),
      },
      { merge: true }
    );

    if (type != null) {
      await db
        .doc(id)
        .set(
          {
            type: type,
          },
          { merge: true }
        )
        .then(() => {
          dispatchToast(
            'Successfully updated post.',
            toastState.show,
            'Success',
            'success'
          );
        });
    }

    if (image != null) {
      await storageRef
        .child(id)
        .delete()
        .then(() => {
          const upload = storageRef.child(`${id}`).put(image);

          upload
            .then(() => {
              storageRef
                .child(id)
                .getDownloadURL()
                .then((url) => {
                  db.doc(id)
                    .set(
                      {
                        url,
                      },
                      { merge: true }
                    )
                    .then(() => {
                      dispatchToast(
                        'Successfully updated post.',
                        toastState.show,
                        'Upload Successful.',
                        'success'
                      );
                    });
                });
            })
            .catch(() => {
              dispatchToast(
                'Failed to upload post.',
                toastState.show,
                'Something went wrong..',
                'danger'
              );
            });
        });
    }

    setLoading(false);
    setdisabled(false);
  }

  return (
    <React.Fragment>
      <Col>
        <Row>
          <Jumbotron className='w-100'>
            <h1>Edit Post</h1>
          </Jumbotron>
        </Row>

        <Row>
          <Col>
            <Jumbotron className='w-100'>
              <Container>
                <Form onSubmit={editPost}>
                  <Form.Group>
                    <Form.Label>
                      <b>Enter Title</b>
                    </Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Title'
                      required
                      style={{ width: '50%' }}
                      className='border'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className='border'
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      <b>Enter Content </b>
                    </Form.Label>
                    <RichTextEditor value={content} onChange={setContent} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label style={{ fontSize: '10', fontWeight: 'bold' }}>
                      Enter Banner Image
                    </Form.Label>
                    <Form.File
                      accept='image/*'
                      style={{ width: 300 }}
                      onChange={handleImage}
                    />
                    <Form.Label style={{ fontSize: '10', fontWeight: 'bold' }}>
                      <span style={{ color: 'red' }}>Note</span>: If you dont
                      want to replace the current banner, leave this empty.
                    </Form.Label>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      <b>Select Post Category</b>
                    </Form.Label>
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
              </Container>
            </Jumbotron>
          </Col>
        </Row>
      </Col>
    </React.Fragment>
  );
}
