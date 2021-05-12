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
    <Col>
      <Row style={{ marginTop: 150, marginBottom: 50 }}>
        <h1>Contact</h1>
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
    </Col>
  );
}

export default Contact;
