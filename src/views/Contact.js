import { useEffect } from 'react';
import { Col, Row, Jumbotron, Form, Button } from 'react-bootstrap';
import { pageView } from '../utils/firebaseUtils';

function Contact() {
  useEffect(() => {
    pageView('contact');
  }, []);
  return (
    <Col>
      <Row style={{ marginTop: 150, marginBottom: 50 }}>
        <Jumbotron className='w-100'>
          <Row>
            <Col lg={4}>
              <h3>Message us on Facebook.</h3>
            </Col>

            <Col lg={4}>
              <h3>Report a crime</h3>
              <p>report a crime around your area:</p>
              <Form>
                <Form.Group>
                  <Form.Label>Enter Name</Form.Label>
                  <Form.Control type='text' className='border' />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Enter Phone Number</Form.Label>
                  <Form.Control type='text' className='border' />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Enter Address</Form.Label>
                  <Form.Control type='text' className='border' />
                </Form.Group>
                <Button type='submit' variant='danger'>
                  Submit
                </Button>
              </Form>
            </Col>
            <Col lg={4}>
              <h3>Call our hotline.</h3>
            </Col>
          </Row>
        </Jumbotron>
      </Row>
    </Col>
  );
}

export default Contact;
