import React, { useEffect, useState, useRef } from 'react';
import { Col, Image, Jumbotron, Row, Button, Spinner } from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import '../styles/posts.css';
import { pageView } from '../utils/firebaseUtils';
import SpinnerPlaceholder from '../components/SpinnerPlaceholder';

function handleImageLoading(setLoading, ref, data) {
  ref.current = data;

  if (ref.current === data) {
    setLoading(false);
  }
}

function NewsAndEvents() {
  const db = firestore.collection('posts');
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState();
  const imageRef = useRef();
  const [showSpinner, setShowSpinner] = useState(true);
  const types = [
    { label: 'News', value: 'news' },
    { label: 'Events', value: 'events' },
    { label: 'Others', value: 'others' },
  ];
  const colours = ['#135DD8', '#EF1E1E', '#000000'];

  useEffect(() => {
    function getData() {
      let tempArray = [];
      setLoading(true);
      db.orderBy('timestamp', 'desc')
        .get()
        .then((q) => {
          if (q.empty) {
            return setPosts([]);
          }

          q.forEach((doc) => {
            tempArray.push(doc.data());
          });

          let filtered = tempArray.filter((item) => {
            return item.published === true;
          });

          setPosts(filtered);
        });
      setLoading(false);
    }
    pageView('webapp');

    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function RenderTypes() {
    if (posts === null || typeof posts === 'undefined') {
      return null;
    }
    if (posts) {
      if (posts.length === 0) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p>No Posts</p>
          </div>
        );
      }
    }

    return types.map((type, index) => {
      return (
        <Row key={type.value} className='w-100 mt-5'>
          <Col lg={10} className='w-100'>
            <Row lg={4} className='w-100'>
              <h3
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: colours[index],
                }}
              >
                {type.label}
              </h3>
            </Row>

            <Row style={{ width: '100%' }}>
              <RenderPosts type={type} />
            </Row>
          </Col>

          <Col className='w-100 m-5'>
            <Link to={`/news-and-events/${type.value}`}>
              <Button>View All</Button>
            </Link>
          </Col>
        </Row>
      );
    });
  }

  function RenderPosts({ type }) {
    if (posts === null || typeof posts === 'undefined') {
      return null;
    }
    if (posts) {
      if (posts.length === 0) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p>No Posts</p>
          </div>
        );
      }
    }

    let filtered = posts.filter((post) => {
      return post.type.value === type.value;
    });

    return filtered.map((post, index) => {
      return index === 0 || index === 1 || index === 2 ? (
        <Col md={6} lg={4} xs={12} key={post.id}>
          <Link to={`/news-and-events/${post.id}`}>
            {showSpinner && <SpinnerPlaceholder centered={true} size='lg' />}
            <Image
              src={post.url}
              style={{
                width: '100%',
                boxShadow:
                  'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
                visibility: showSpinner ? 'hidden' : 'visible',
              }}
              loading={'lazy'}
              onLoad={() => {
                handleImageLoading(setShowSpinner, imageRef, post.imagesURL);
              }}
            />

            <div
              id='postDesc'
              style={{
                boxShadow:
                  'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
              }}
            >
              <Row
                lg={12}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <p style={{ color: 'white', fontSize: 15 }}>{post.title}</p>
              </Row>
              <Row
                lg={12}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <p style={{ color: 'white', fontSize: 9 }}>{post.date}</p>
              </Row>
            </div>
          </Link>
        </Col>
      ) : null;
    });
  }

  return (
    <React.Fragment>
      <Col className='wrapper'>
        <Row style={{ marginTop: 150, marginBottom: 50 }}>
          <Jumbotron className='w-100'>
            <h1 className='title'>News and Events</h1>
            <Row className='w-100'>
              <Col></Col>
              <Col lg={10}>
                {loading ? (
                  <div
                    style={{
                      minHeight: '350px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Spinner animation='border' />
                  </div>
                ) : (
                  <RenderTypes />
                )}
              </Col>
              <Col></Col>
            </Row>
          </Jumbotron>
        </Row>
      </Col>
    </React.Fragment>
  );
}
export default NewsAndEvents;
