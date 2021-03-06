import React, { useState, useEffect, useRef } from 'react';
import {
  Jumbotron,
  Row,
  Col,
  Button,
  Spinner,
  Container,
  Image,
  Modal,
  ButtonGroup,
  Form,
} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { firestore, storage } from '../../firebase/firebase';
import EditRTE from './EditRTE';
import { useHistory } from 'react-router-dom';

export default function ManagePost() {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const { currentUser } = useAuth();

  const db = firestore.collection('posts');
  const storageRef = storage.ref('images');

  const titleRef = useRef();
  const subtitleRef = useRef();
  const contentRef = useRef();
  const imageRef = useRef();
  const getContent = useRef('');

  function RenderPosts() {
    if (posts.length === 0) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p>No Published Posts.</p>
        </div>
      );
    }

    return posts.map((post, index) => {
      return (
        <Row key={index} className='border p-3'>
          <Col lg={10}>
            <Row>
              <h3>{post.title}</h3>
            </Row>
            <Row>
              <div className='m-3'>
                {post.url ? (
                  <Image src={post.url} width='200px' height='100%' />
                ) : (
                  <p>No Image :(</p>
                )}
              </div>
            </Row>
            <Row>
              <p>
                <b>Upload Date:</b> {post.date}
              </p>
            </Row>
            <Row>
              <p>
                <b>Upload Time:</b> {post.time}
              </p>
            </Row>
          </Col>

          <Col className='m-auto'>
            <Row>
              <Button
                variant='primary'
                size='sm'
                className='m-3 w-75'
                onClick={() => {
                  history.push(`/dashboard/posts/edit/${post.id}`);
                }}
              >
                Edit
              </Button>
              <Button
                variant='danger'
                size='sm'
                className='m-3 w-75'
                onClick={() => {
                  setShowModal(true);
                  setSelectedItem(post);
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

  function setContentToRef(value) {
    getContent.current = value;
  }

  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function getData() {
    let postsArray = [];

    setLoading(true);

    await db
      .where('published', '==', true)
      .orderBy('timestamp', 'desc')
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            postsArray.push(doc.data());
          }
        });
      });

    let filtered = postsArray.filter((post) => {
      return post.author === currentUser.email;
    });

    setPosts(filtered);

    setLoading(false);
  }

  async function editPost(e) {
    e.preventDefault();

    ///check if content is empty
    if (getContent.current == null) {
      setMessage({ type: 'danger', msg: 'Content cannot be empty.' });
    } else if (getContent.current.toString('html') === '<p><br></p>') {
      setMessage({ type: 'danger', msg: 'Content cannot be empty.' });
    } else {
      await db
        .doc(selectedItem.id)
        .set(
          {
            title: titleRef.current,
            subtitle: subtitleRef.current,
          },
          { merge: true }
        )
        .then(() => {
          setMessage({ type: 'primary', msg: 'Successfully updated post.' });
        });

      if (typeof getContent.current != 'undefined') {
        await db
          .doc(selectedItem.id)
          .set(
            {
              content: getContent.current.toString('html'),
            },
            { merge: true }
          )
          .then(() => {
            setMessage({ type: 'primary', msg: 'Successfully updated post.' });
          });
      }

      if (imageRef.current != null) {
        await storageRef
          .child(selectedItem.id)
          .delete()
          .then(() => {
            const upload = storageRef
              .child(`${selectedItem.id}`)
              .put(imageRef.current);

            upload
              .then(() => {
                storageRef
                  .child(selectedItem.id)
                  .getDownloadURL()
                  .then((url) => {
                    db.doc(selectedItem.id)
                      .set(
                        {
                          url,
                        },
                        { merge: true }
                      )
                      .then(() => {
                        setMessage({
                          type: 'primary',
                          msg: 'Successfully updated post.',
                        });
                      });
                  });
              })
              .catch((e) => {
                setMessage({ type: 'danger', msg: `Error: ${e}` });
              });
          });
      }
    }

    setEditModal(false);
    setShowMessageModal(true);
    titleRef.current = undefined;
    subtitleRef.current = undefined;
    getContent.current = undefined;
    imageRef.current = undefined;
    e.target.reset();
  }

  function handleImage(e) {
    if (e.target.files[0]) {
      imageRef.current = e.target.files[0];
    }
  }

  function EditModal() {
    if (selectedItem === null || typeof selectedItem === 'undefined') {
      return null;
    }

    titleRef.current = selectedItem.title;
    subtitleRef.current = selectedItem.subtitle;
    contentRef.current = selectedItem.content;

    return (
      <Modal
        show={editModal}
        onHide={() => {
          setEditModal(false);
        }}
        centered
        dialogClassName='edit-modal'
      >
        <Modal.Header closeButton>
          <h3>Edit Post</h3>
        </Modal.Header>
        <Modal.Body>
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
                defaultValue={titleRef.current}
                onChange={(event) => {
                  titleRef.current = event.target.value;
                }}
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
                className='border'
                defaultValue={subtitleRef.current}
                onChange={(event) => {
                  subtitleRef.current = event.target.value;
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <span style={{ color: 'red' }}>NOTE</span>: If you don't want to
                change the image, ignore this.
              </Form.Label>
              <Form.File
                label='Enter Banner Image'
                accept='image/*'
                style={{ width: 300 }}
                onChange={handleImage}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                <b>Enter Content </b>
              </Form.Label>

              <EditRTE post={selectedItem} sendData={setContentToRef} />
            </Form.Group>

            <div
              className='mt-5'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button
                variant='primary'
                type='submit'
                className='mt-5 w-25 m-auto'
                size='md'
              >
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              variant='danger'
              size='sm'
              className='w-75 m-3'
              onClick={() => {
                setEditModal(false);
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  function deletePost(item) {
    handleCloseModal();

    const deleteTask = storageRef.child(`${item.id}`);
    console.log(item.id);
    deleteTask
      .delete()
      .then(() => {
        setMessage({ type: 'primary', msg: `Deleted ${item.title}` });
      })
      .catch(() => {
        setMessage({ type: 'danger', msg: `Cannot delete ${item.title}` });
      });

    db.doc(item.id)
      .delete()
      .then(() => {
        setMessage({ type: 'primary', msg: 'Successfully deleted post' });
      })
      .catch(() => {
        setMessage({ type: 'danger', msg: 'Failed to delete post' });
      });

    setSelectedItem();
    setShowMessageModal(true);
  }

  function DeleteModal() {
    if (selectedItem === null || typeof selectedItem === 'undefined') {
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
                deletePost(selectedItem);
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
        show={showMessageModal}
        onHide={() => {
          setShowMessageModal(false);
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
                setShowMessageModal(false);
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

  return (
    <React.Fragment>
      <Col>
        <Row>
          <Jumbotron className='w-100'>
            <h1>Manage Posts</h1>
          </Jumbotron>
        </Row>
        <Row>
          <Jumbotron className='w-100'>
            <Container>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Spinner animation='border' className='m-auto' />
                </div>
              ) : (
                <RenderPosts />
              )}

              <DeleteModal />
              <MessageModal />
              <EditModal />
            </Container>
          </Jumbotron>
        </Row>
      </Col>
    </React.Fragment>
  );
}
