import { useEffect } from 'react';
import { Col, Row, Jumbotron } from 'react-bootstrap';
import { firestore, firebase } from '../firebase/firebase';

function Contact() {
  useEffect(() => {
    async function pageView() {
      const analytics = firestore.collection('analytics');
      const date = new Date();

      analytics.doc('contact').set(
        {
          pageview: firebase.firestore.FieldValue.arrayUnion(date),
        },
        { merge: true }
      );
    }

    pageView();
  }, []);
  return (
    <>
      <Row style={{ marginTop: 100 }}>
        <Jumbotron className='w-100 mt-2'>
          <h1>Contact</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          <Row>
            <Col lg={4}>
              <h3>Message us on Facebook.</h3>
            </Col>
            <Col lg={4}>
              <h3>Call our hotline.</h3>
            </Col>
            <Col lg={4}>
              <h3>Report a crime.</h3>
            </Col>
          </Row>
        </Jumbotron>
      </Row>
    </>
  );
}

export default Contact;
