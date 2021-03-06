import React, { useEffect, useState } from 'react';
import {
  Col,
  Container,
  Image,
  Jumbotron,
  Row,
  Spinner,
  Pagination,
  Button,
  Breadcrumb,
} from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { pageView } from '../utils/firebaseUtils';
import LazyLoad from 'react-lazyload';
import SpinnerPlaceholder from '../components/SpinnerPlaceholder';

export default function RenderPosts({ type }) {
  if (type) {
    console.log(type);
  }
  const db = firestore.collection('posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [pageNumbers, setPageNumbers] = useState();

  useEffect(() => {
    pageView('webapp');
    async function getData() {
      setLoading(true);
      let tempArray = [];
      await db
        .orderBy('timestamp', 'desc')
        .get()
        .then((q) => {
          if (q.empty) {
            return setPosts([]);
          }

          q.forEach((doc) => {
            tempArray.push(doc.data());
          });

          let filtered = tempArray.filter((post) => {
            return post.published === true && post.type.value === `${type}`;
          });

          setPosts(filtered);
          paginateNumbers(filtered);

          setLoading(false);
        });
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
        <Row className='w-100 p-3 border' style={{ height: '25%' }} key={index}>
          <Col lg={3}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              {post.url ? (
                <LazyLoad placeholder={<SpinnerPlaceholder />}>
                  <Image src={post.url} width='200px' height='100%' />
                </LazyLoad>
              ) : (
                <p>NO IMAGE</p>
              )}
            </div>
          </Col>

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

            <Row className='w-100'>
              <div className='m-auto'>
                <Link to={`/news-and-events/${post.id}`}>
                  <Button>Read</Button>
                </Link>
              </div>
            </Row>
          </Col>
        </Row>
      );
    });
  }

  return (
    <React.Fragment>
      <Row style={{ marginTop: 150, marginBottom: 50 }}>
        <Jumbotron className='w-100 mt-2'>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to='/news-and-events'> News and Events</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>News</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className='title'>News</h1>
          <Container>
            {loading ? (
              <div
                style={{
                  minHeight: '350px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Spinner animation='border' />{' '}
              </div>
            ) : (
              <RenderPosts />
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              {pageNumbers && (
                <Pagination size='sm'>
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
          </Container>
        </Jumbotron>
      </Row>
    </React.Fragment>
  );
}
