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
  Card,
} from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { pageView } from '../utils/firebaseUtils';
import { BsFilePost } from 'react-icons/bs';
import { FaMapMarkedAlt, FaDownload } from 'react-icons/fa';
import { GrGallery } from 'react-icons/gr';
import '../styles/home.css';
import DOMPurify from 'dompurify';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const db = firestore.collection('posts');
  const [announcement, setAnnouncement] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [pageNumbers, setPageNumbers] = useState();
  const scrollRef = useRef(null);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

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
          className='p-3 mb-3 w-100 posts'
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
                  <Button className='button'>Read</Button>
                </Link>
              </div>
            </Row>
          </Col>
        </Row>
      );
    });
  }

  // function RenderAnnouncements() {
  //   if (announcement === null || typeof announcement === undefined) return null;

  //   if (announcement) {
  //     if (announcement.length === 0) {
  //       return (
  //         <div style={{ display: 'flex', justifyContent: 'center' }}>
  //           <p>No Published Announcements</p>
  //         </div>
  //       );
  //     }
  //   }

  //   return announcement.map((item) => {
  //     return (
  //       <Col key={item.id}>
  //         <Card
  //           className='text-center'
  //           style={{
  //             boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
  //             width: '30rem',
  //           }}
  //         >
  //           <Card.Body style={{ padding: 35 }}>
  //             <Card.Title>
  //               <h3>{item.title}</h3>
  //             </Card.Title>
  //             <Card.Text style={{ textAlign: 'center' }}>
  //               <div
  //                 dangerouslySetInnerHTML={{
  //                   __html: DOMPurify.sanitize(item.content),
  //                 }}
  //                 style={{ textAlign: 'justify', fontSize: 20 }}
  //                 className='w-100'
  //               ></div>
  //             </Card.Text>
  //           </Card.Body>
  //           <Card.Footer muted>
  //             {item.timestamp.toDate().toDateString()}
  //           </Card.Footer>
  //         </Card>
  //       </Col>
  //     );
  //   });
  // }

  return (
    <React.Fragment>
      <Col className='wrapper'>
        <Row style={{ marginTop: 100 }}>
          <Jumbotron
            className='w-100 jumbotrons bg-light'
            style={{
              boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px',
            }}
          >
            <Row className='w-100'>
              <h2 style={{ marginLeft: '20px' }}>Announcements</h2>
              <Carousel
                swipeable={true}
                draggable={true}
                showDots={false}
                arrows={true}
                responsive={responsive}
                ssr={false} // means to render carousel on server-side.
                infinite={true}
                containerClass='carousel-container'
                removeArrowOnDeviceType={['tablet', 'mobile']}
                itemClass={'carousel-item-padding-0-px'}
              >
                {announcement &&
                  announcement.map((item) => {
                    return (
                      <Col key={item.id} style={{ margin: '50' }}>
                        <Card
                          className='text-center'
                          style={{
                            boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                            width: '30rem',
                          }}
                        >
                          <Card.Body>
                            <Card.Title>
                              <h3>{item.title}</h3>
                            </Card.Title>
                            <Card.Text style={{ textAlign: 'center' }}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(item.content),
                                }}
                                style={{ textAlign: 'justify', fontSize: 20 }}
                                className='w-100'
                              ></div>
                            </Card.Text>
                          </Card.Body>
                          <Card.Footer muted>
                            {item.timestamp.toDate().toDateString()}
                          </Card.Footer>
                        </Card>
                      </Col>
                    );
                  })}
              </Carousel>
            </Row>
          </Jumbotron>
        </Row>
        <Row>
          <Jumbotron className='w-100 bg-dark' style={{ border: 'none' }}>
            <Row
              className='w-100'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card className='text-center cards'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <BsFilePost className='cards-icon' />
                </div>
                <Card.Body>
                  <Card.Title>
                    <h3 className='cardHeader'>Posts</h3>
                  </Card.Title>
                  <Card.Text>
                    Catch up with the latest news from the PNP. The latest news
                    and events at your fingertips.
                  </Card.Text>
                </Card.Body>
                <Card.Footer
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Link to='/news-and-events'>
                    <Button>Go to Posts</Button>
                  </Link>
                </Card.Footer>
              </Card>

              <Card className='text-center cards'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FaMapMarkedAlt className='cards-icon' />
                </div>
                <Card.Body>
                  <Card.Title>
                    <h3 className='cardHeader'>Map</h3>
                  </Card.Title>
                  <Card.Text>
                    See the map of Laguna and its Municipalities and Cities.
                  </Card.Text>
                </Card.Body>
                <Card.Footer
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Link to='/maps'>
                    <Button>Go to Map</Button>
                  </Link>
                </Card.Footer>
              </Card>

              <Card className='text-center cards'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <GrGallery className='cards-icon' />
                </div>
                <Card.Body>
                  <Card.Title>
                    <h3 className='cardHeader'>Gallery</h3>
                  </Card.Title>
                  <Card.Text>
                    Browse the galleries of the PNP. Relive the latest events
                    through these images.
                  </Card.Text>
                </Card.Body>
                <Card.Footer
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Link to='/gallery'>
                    <Button>Go to Galleries</Button>
                  </Link>
                </Card.Footer>
              </Card>

              <Card className='text-center cards'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FaDownload className='cards-icon' />
                </div>
                <Card.Body>
                  <Card.Title>
                    <h3 className='cardHeader'>Downloads</h3>
                  </Card.Title>
                  <Card.Text>
                    Get all the downloadables in one streamlined page. Whether
                    you need forms or advisories, the downloads page got you
                    covered.
                  </Card.Text>
                </Card.Body>
                <Card.Footer
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Link to='/downloads'>
                    <Button>Go to Downloads</Button>
                  </Link>
                </Card.Footer>
              </Card>
            </Row>
          </Jumbotron>
        </Row>
        <Row></Row>
        <Row>
          <Col lg={1}></Col>
          <Col ref={scrollRef}>
            <Jumbotron
              className='w-100'
              style={{
                boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px',
              }}
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
                    <Pagination size='md'>
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
          </Col>
          <Col lg={1}></Col>
        </Row>
      </Col>
    </React.Fragment>
  );
}
export default Home;
