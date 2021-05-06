import { useEffect, useState } from 'react';
import NavBarMain from '../components/NavBarMain';
import FooterMain from '../components/FooterMain';
import {
  Col,
  Container,
  Image,
  Jumbotron,
  Row,
  Spinner,
} from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import '../styles/posts.css';

function NewsAndEvents() {
  const db = firestore.collection('posts');
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState();

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
      db.get().then((q) => {
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

    getData();
  }, []);

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
        <Row key={type.value} className='w-100 border p-3'>
          <Col lg={10} className='w-100 border'>
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

            <Row className='w-100'>
              <RenderPosts type={type} />
            </Row>
          </Col>

          <Col className='w-100 border'>
            <Link> View All</Link>
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
      return (
        <Col md={6} lg={4} xs={12} key={post.id} className='border'>
          {index === 0 ? (
            <div>
              <Image src={post.url} width='100%' height='100%' />
              <div id='postDesc'>
                <Row lg={12} className='w-100'>
                  <p style={{ color: 'white' }}>{post.title}</p>
                </Row>
                <Row lg={12} className='w-100'>
                  <p style={{ color: 'white', fontSize: 10 }}>
                    {post.subtitle}
                  </p>
                </Row>
              </div>
            </div>
          ) : null}

          {index === 1 ? <p>{post.title}</p> : null}

          {index === 2 ? <p>{post.title}</p> : null}

          {index === 4 ? <p>{post.title}</p> : null}
        </Col>
      );
    });
  }

  return (
    <>
      <Col>
        <Row>
          <Container style={{ marginTop: 100 }} />

          <NavBarMain />
        </Row>

        <Row>
          <Jumbotron className='w-100'>
            <h1 className='title'>News and Events</h1>
          </Jumbotron>
        </Row>

        <Row>
          <Jumbotron className='w-100 mt-2'>
            <Row className='w-100'>
              <Container>
                {loading ? <Spinner animation='border' /> : <RenderTypes />}
              </Container>
            </Row>
          </Jumbotron>
        </Row>

        <FooterMain />
      </Col>
    </>
  );
}
export default NewsAndEvents;
