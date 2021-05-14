import { useParams, Link } from 'react-router-dom';
import {
  Jumbotron,
  Col,
  Row,
  Breadcrumb,
  Spinner,
  Image,
} from 'react-bootstrap';
import { firestore, firebase } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

export default function PostEntry() {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState([]);
  const { id } = useParams();
  const [type, setType] = useState(undefined);
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
        );
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      setType(item);
      return (
        <Row
          style={{ display: 'flex', justifyContent: 'center' }}
          key={item.id}
          className='w-100'
        >
          <Row className='w-100'>
            <h2>{item.title}</h2>
          </Row>
          <Row className='w-100'>
            <p style={{ textAlign: 'justify' }} className='m-auto'>
              {item.subtitle}
            </p>
          </Row>

          <Row className='w-100'>
            <Image
              src={item.url}
              style={{ height: '100%', width: 1000 }}
              className='m-auto'
            />
          </Row>
          <Row
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(item.content),
            }}
            style={{ textAlign: 'justify' }}
            className='w-100'
          ></Row>
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
        <Row style={{ marginTop: 150 }}>
          <Row className='w-100'>
            <Jumbotron
              className='mt-2 w-100'
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Col>
                <Row className='w-100'>
                  {type && (
                    <Breadcrumb>
                      <Breadcrumb.Item>
                        <Link to={`/news-and-events`}>News and Events</Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <Link to={`/news-and-events/${type.type.value}`}>
                          {type.type.label}
                        </Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item active>{type.title}</Breadcrumb.Item>
                    </Breadcrumb>
                  )}
                </Row>
                <Row className='w-100'>
                  <Col lg={1}></Col>
                  <Col lg={10}>
                    {loading ? (
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Spinner animation='border' />{' '}
                      </div>
                    ) : (
                      <RenderPost />
                    )}
                  </Col>
                  <Col lg={1}></Col>
                </Row>
              </Col>
            </Jumbotron>
          </Row>
        </Row>
      </Col>
    </>
  );
}
