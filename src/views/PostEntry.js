import { useParams, Link, useHistory } from 'react-router-dom';
import {
  Jumbotron,
  Col,
  Row,
  Breadcrumb,
  Spinner,
  Image,
} from 'react-bootstrap';
import { firestore, firebase } from '../firebase/firebase';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

export default function PostEntry() {
  const history = useHistory();
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
          pageView(id);
          setPost(temp);
          return;
        }

        return history.push('/404');
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '250px',
            }}
          >
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
          className='w-100 m-auto'
        >
          <Row className='w-100'>
            <h1>{item.title}</h1>
          </Row>
          <Row className='w-100'>
            <p style={{ textAlign: 'justify' }} className='m-auto'>
              {item.subtitle}
            </p>
          </Row>
          <Row className='w-100'>
            <p
              style={{ textAlign: 'justify', fontWeight: 'bold', fontSize: 10 }}
              className='m-auto'
            >
              {item.date}
            </p>
          </Row>

          <Row className='w-100 m-5'>
            <Image
              src={item.url}
              style={{
                height: '100%',
                width: '100%',
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
              }}
              className='m-auto'
            />
          </Row>
          <Row
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(item.content),
            }}
            style={{ textAlign: 'justify', fontSize: 20 }}
            className='w-100'
          ></Row>
        </Row>
      );
    });
  }

  return (
    <React.Fragment>
      <Col>
        <Row style={{ marginTop: 150 }}>
          <Row className='w-100'>
            <Jumbotron className='w-100' style={{ padding: 0 }}>
              {type && (
                <Breadcrumb style={{ margin: 20 }}>
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
            </Jumbotron>
          </Row>
          <Row className='w-100'>
            <Jumbotron className='w-100'>
              <Col lg={2}></Col>
              <Col className='w-100'>
                <Row className='w-100'>
                  <Col lg={1}></Col>
                  <Col lg={10}>
                    {loading ? (
                      <div
                        style={{
                          height: '250px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Spinner animation='border' />
                      </div>
                    ) : (
                      <RenderPost />
                    )}
                  </Col>
                  <Col lg={1}></Col>
                </Row>
              </Col>
              <Col lg={2}></Col>
            </Jumbotron>
          </Row>
        </Row>
      </Col>
    </React.Fragment>
  );
}
