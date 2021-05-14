import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Row,
  Col,
  Spinner,
  Image,
  Container,
  Button,
  Pagination,
  Alert,
} from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { pageView } from '../utils/firebaseUtils';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const db = firestore.collection('posts');
  const [announcement, setAnnouncement] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const [pageNumbers, setPageNumbers] = useState();

  useEffect(() => {
    pageView('home');

    async function getData() {
      let tempArray = [];
      setLoading(true);
      await db
        .where('published', '==', true)
        .orderBy('timestamp', 'desc')
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            return;
          }

          querySnapshot.forEach((doc) => {
            tempArray.push(doc.data());
          });
        });

      setPosts(tempArray);
      paginateNumbers(tempArray);

      let annArray = [];

      firestore
        .collection('announcements')
        .orderBy('timestamp', 'desc')
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            return;
          }

          querySnapshot.forEach((doc) => {
            annArray.push(doc.data());
          });
          setAnnouncement(annArray);
        });

      setLoading(false);
    }

    getData();

    function paginateNumbers(arr) {
      let temp = [];
      let totalPosts = arr.length;

      for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        temp.push(i);
      }
      setPageNumbers(temp);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function paginate(num) {
    setCurrentPage(num);
  }

  function RenderPosts() {
    if (posts === null || typeof posts === undefined) return null;

    if (posts) {
      if (posts.length === 0) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p>No Published Posts</p>
          </div>
        );
      }
    }

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return currentPosts.map((post, index) => {
      return (
        <Row className='p-1' key={index}>
          <Col lg={2}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {post.url ? (
                <Image src={post.url} width='350px' height='100%' />
              ) : (
                <p>NO IMAGE</p>
              )}
            </div>
          </Col>
          <Col></Col>

          <Col lg={9}>
            <Row className='w-100 m-auto'>
              <h3>{post.title}</h3>
            </Row>
            <Row className='w-100 m-auto'>
              <p>{post.subtitle}</p>
            </Row>
            <Row className='w-100 m-auto'>
              <p style={{ fontSize: 15 }}>{post.date}</p>
            </Row>

            <Row className='w-100 m-auto'>
              <div className='m-auto'>
                <Link to={`news-and-events/${post.id}`}>
                  <Button>Read</Button>
                </Link>
              </div>
            </Row>
          </Col>
        </Row>
      );
    });
  }

  function RenderAnnouncements() {
    if (announcement === null || typeof announcement === undefined) return null;

    if (announcement) {
      if (announcement.length === 0) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p>No Published Announcements</p>
          </div>
        );
      }
    }

    return announcement.map((item) => {
      return (
        <Alert variant='primary' key={item.id}>
          <Alert.Heading>{item.title}</Alert.Heading>
          <p>{item.content}</p>
          <p>{item.dateUploaded}</p>
        </Alert>
      );
    });
  }

  return (
    <>
      <Col>
        <Row style={{ marginTop: 150, marginBottom: 50 }}>
          <Row>
            <Col className='border'>
              <Row>
                <Jumbotron className='w-100'>
                  <h1 className='title'>Latest Post</h1>
                  <Col lg={1}></Col>
                  <Col>
                    <Container>
                      {loading ? (
                        <Spinner animation='border' className='m-auto' />
                      ) : (
                        <RenderPosts />
                      )}
                    </Container>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 20,
                      }}
                    >
                      {pageNumbers && (
                        <Pagination size='lg'>
                          {pageNumbers.map((num, index) => {
                            return (
                              <Pagination.Item
                                onClick={() => {
                                  paginate(num);
                                }}
                                key={index}
                              >
                                {num}
                              </Pagination.Item>
                            );
                          })}
                        </Pagination>
                      )}
                    </div>
                  </Col>
                </Jumbotron>
              </Row>
            </Col>

            <Col lg={3} className='border'>
              <Jumbotron>
                <h1>Announcements</h1>
                <RenderAnnouncements />
              </Jumbotron>
            </Col>
          </Row>
        </Row>
      </Col>
    </>
  );
}
export default Home;
