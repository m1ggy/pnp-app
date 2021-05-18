import React, { useState, useEffect, useRef } from 'react';
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
  Card,
} from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { pageView } from '../utils/firebaseUtils';
import { BsFilePost } from 'react-icons/bs';
import { FaMapMarkedAlt, FaDownload } from 'react-icons/fa';
import { GrGallery } from 'react-icons/gr';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const db = firestore.collection('posts');
  const [announcement, setAnnouncement] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [pageNumbers, setPageNumbers] = useState();
  const scrollRef = useRef(null);

  useEffect(() => {
    pageView('webapp');

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
        <Row
          className='p-3 mb-3 w-100'
          key={index}
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
          }}
        >
          <Col lg={4} className='w-100 h-75'>
            {post.url ? (
              <Image
                src={post.url}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              />
            ) : (
              <p>NO IMAGE</p>
            )}
          </Col>
          <Col lg={1}></Col>

          <Col>
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
        <Alert variant='success' key={item.id}>
          <Alert.Heading>{item.title}</Alert.Heading>
          <p style={{ fontSize: 15 }}>{item.content}</p>
          <p style={{ fontSize: 10 }}>{item.dateUploaded}</p>
        </Alert>
      );
    });
  }

  return (
    <>
      <Col>
        <Row style={{ marginTop: 100 }}>
          <Jumbotron
            className='w-100 bg-light'
            style={{
              boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
              className='w-100'
            >
              <div style={{ width: '20%' }}></div>
              <Image
                style={{
                  width: 175,
                  height: '90%',
                  imageRendering: 'auto',
                }}
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Philippine_National_Police_seal.svg/1200px-Philippine_National_Police_seal.svg.png'
              />
              <div style={{ width: '3%' }}></div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                className='w-50'
              >
                <h1
                  style={{
                    textShadow: ' 22px 18px 4px rgba(150, 147, 150, 0.49)',
                  }}
                >
                  {' '}
                  To Serve and Protect. <br></br>Service, Honor, Justice.
                </h1>
              </div>
            </div>
          </Jumbotron>
        </Row>
        <Row>
          <Jumbotron className='w-100 bg-light' style={{ border: 'none' }}>
            <Row
              className='w-100'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Col>
                <Card
                  style={{
                    width: '25rem',
                    height: 500,
                    boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px',
                    margin: 10,
                  }}
                  className='text-center'
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <BsFilePost
                      style={{
                        width: '150',
                        height: '100%',
                        margin: 25,
                        color: 'black',
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>
                      <h3>Posts</h3>
                    </Card.Title>
                    <Card.Text>
                      Catch up with the latest news from the PNP. The latest
                      news and events at your fingertips.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Link to='/news-and-events'>
                      <Button>Go to Posts</Button>
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
              <Col>
                <Card
                  style={{
                    width: '25rem',
                    height: 500,
                    boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px',
                    margin: 10,
                  }}
                  className='text-center'
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FaMapMarkedAlt
                      style={{
                        width: '150',
                        height: '100%',
                        margin: 25,
                        color: 'black',
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>
                      <h3>Map</h3>
                    </Card.Title>
                    <Card.Text>
                      Become alert with your surroundings! see the crime
                      frequency around your area through the use of the PNP Map.
                      With the use of machine learning, the map predicts crime
                      time and type.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Link to='/maps'>
                      <Button>Go to Map</Button>
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
              <Col>
                <Card
                  style={{
                    width: '25rem',
                    height: 500,
                    boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px',
                    margin: 10,
                  }}
                  className='text-center'
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GrGallery
                      style={{
                        width: '150',
                        height: '100%',
                        margin: 25,
                        color: 'black',
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>
                      <h3>Gallery</h3>
                    </Card.Title>
                    <Card.Text>
                      Browse the galleries of the PNP. Relive the latest events
                      through these images.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Link to='/gallery'>
                      <Button>Go to Galleries</Button>
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
              <Col>
                <Card
                  style={{
                    width: '25rem',
                    height: 500,
                    boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px',
                    margin: 10,
                  }}
                  className='text-center'
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FaDownload
                      style={{
                        width: '150',
                        height: '100%',
                        margin: 25,
                        color: 'black',
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>
                      <h3>Downloads</h3>
                    </Card.Title>
                    <Card.Text>
                      Get all the downloadables in one streamlined page. Whether
                      you need forms or advisories, the downloads page got you
                      covered.
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer ref={scrollRef}>
                    <Link to='/downloads'>
                      <Button>Go to Downloads</Button>
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </Jumbotron>
        </Row>
        <Row>
          <Col lg={1}></Col>
          <Col>
            <Row>
              <Jumbotron
                className='w-100 pl-5'
                style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
              >
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
                                scrollRef.current.scrollIntoView();
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

          <Col lg={3}>
            <Jumbotron
              style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
            >
              <h1>Announcements</h1>
              <RenderAnnouncements />
            </Jumbotron>
          </Col>
          <Col lg={1}></Col>
        </Row>
      </Col>
    </>
  );
}
export default Home;
