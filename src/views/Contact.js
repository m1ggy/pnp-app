import { useEffect } from 'react';
import { Col, Row, Container, Jumbotron, Nav } from 'react-bootstrap';
import NavBarMain from '../components/NavBarMain';
import FooterMain from '../components/FooterMain';
import { firestore } from '../firebase/firebase';
import uniqid from 'uniqid';
function Contact() {
  const analytics = firestore.collection('analytics');

  useEffect(() => {
    async function pageView() {
      const id = uniqid();
      const date = new Date();
      const dateString = date.toDateString();
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
            <Col className='border' lg={4}>
              <h1>Message us on Facebook.</h1>
            </Col>
            <Col className='border' lg={4}>
              <h1>Call our hotline.</h1>
            </Col>
            <Col className='border' lg={4}>
              <h1>Report a crime.</h1>
            </Col>
          </Row>
        </Jumbotron>
      </Row>
    </>
  );
}

export default Contact;
