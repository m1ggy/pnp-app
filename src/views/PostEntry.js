import { useParams, Link } from 'react-router-dom';
import {
  Jumbotron,
  Col,
  Row,
  Breadcrumb,
  Spinner,
  Container,
  Image,
} from 'react-bootstrap';
import NavBarMain from '../components/NavBarMain';
import FooterMain from '../components/FooterMain';
import { firestore, firebase } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import uniqid from 'uniqid';

export default function PostEntry() {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const db = firestore.collection('posts').doc(id);
    const analytics = firestore.collection('analytics');

    function pageView(postID) {
      const date = new Date();

      analytics
        .doc(postID)

        .set(
          {
            pageview: firebase.firestore.FieldValue.arrayUnion(date),
          },
          { merge: true }
        )
        .then(() => {
          console.log('added pageview');
        });
    }

    async function getData() {
      setLoading(true);
      let temp = [];
      await db.get().then((q) => {
        if (q.exists) {
          temp.push(q.data());
        }

        pageView(id);

        setPost(temp);
      });
      setLoading(false);
    }

    getData();
  }, []);

  function RenderPost() {
    if (post === null || typeof post === 'undefined') {
      return null;
    }

    if (post) {
      if (post.length === 0) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p>Cannot find post.</p>
          </div>
        );
      }
    }

    return post.map((item) => {
      return (
        <Row
          style={{ display: 'flex', justifyContent: 'center' }}
          key={item.id}
          className='w-100'
        >
          <Row className='w-100'>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to={`/news-and-events`}>News and Events</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/news-and-events/${item.type.value}`}>
                  {item.type.label}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active>{item.title}</Breadcrumb.Item>
            </Breadcrumb>
          </Row>

          <Row className='w-100'>
            <h2>{item.title}</h2>
          </Row>
          <Row className='w-100'>
            <p style={{ textAlign: 'justify' }} className='m-auto'>
              {item.subtitle}
            </p>
          </Row>

          <Row className='w-100'>
            <Image src={item.url} height='500px' className='m-auto' />
          </Row>

          <Row className='w-100 pr-5 pl-5'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(item.content),
              }}
            ></div>
          </Row>
          <Row className='w-100'>
            <p style={{ textAlign: 'justify' }} className='m-auto'>
              {item.date} {item.time}
            </p>
          </Row>
        </Row>
      );
    });
  }

  return (
    <>
      <Col>
        <Row className='w-100'>
          <Container style={{ marginTop: 100 }}>
            <NavBarMain className='mt-2 w-100 m-auto' />
          </Container>
        </Row>

        <Row>
          <Row className='w-100'>
            <Jumbotron
              className='mt-2 w-100'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Row
                className='w-100'
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {loading ? <Spinner animation='border' /> : <RenderPost />}
              </Row>
            </Jumbotron>
          </Row>
        </Row>

        <FooterMain />
      </Col>
    </>
  );
}
