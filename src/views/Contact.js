import React, { useEffect, useState } from 'react';
import { Col, Row, Jumbotron, Form, Button, Card } from 'react-bootstrap';
import { pageView } from '../utils/firebaseUtils';

import { FaFacebookMessenger, FaTwitter, FaPhone } from 'react-icons/fa';

function Contact() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    pageView('webapp');
  }, []);

  return (
    <Col>
      <Row style={{ marginTop: 100 }}>
        <Jumbotron
          className='w-100 bg-light'
          style={{ boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px' }}
        >
          <Row>
            <Col lg={4}>
              <Card
                className='text-center'
                style={{ boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px' }}
              >
                <Card.Body>
                  <Card.Title>
                    <h3>Message us on Social Media.</h3>
                  </Card.Title>
                  <Card.Text>Get in touch with us!</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Row
                    className='w-100'
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Col
                      className='w-100'
                      style={{
                        display: 'inline-flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <FaFacebookMessenger
                        style={{
                          width: 25,
                          height: '100%',
                          color: 'black',
                          marginRight: '5',
                        }}
                      />
                      <Card.Text style={{ fontSize: 15, alignSelf: 'center' }}>
                        Philippine National Police
                      </Card.Text>
                    </Col>
                    <Col
                      className='w-100'
                      style={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        justifyItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FaTwitter
                        style={{
                          width: 25,
                          height: '100%',
                          color: 'black',
                          marginRight: '5',
                        }}
                      />
                      <Card.Text style={{ fontSize: 15, alignSelf: 'center' }}>
                        @PNP
                      </Card.Text>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
            <Col lg={4}>
              <Card
                className='text-center'
                style={{ boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px' }}
              >
                <Card.Body>
                  <Card.Title>
                    <h3>Report a crime</h3>
                  </Card.Title>
                  <Card.Text>
                    <p>report a crime around your area:</p>
                  </Card.Text>
                  <Form>
                    <Form.Group>
                      <Form.Label>Enter Name</Form.Label>
                      <Form.Control
                        type='text'
                        className='border'
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Enter Phone Number</Form.Label>
                      <Form.Control
                        type='text'
                        className='border'
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Enter Address</Form.Label>
                      <Form.Control
                        type='text'
                        className='border'
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                      />
                    </Form.Group>
                    <Button
                      type='submit'
                      variant='danger'
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Submit
                    </Button>
                  </Form>
                </Card.Body>
                <Card.Footer>
                  <Card.Text>
                    PNP will review your report as soon as possible.
                  </Card.Text>
                </Card.Footer>
              </Card>
            </Col>
            <Col lg={4}>
              <Card
                className='text-center'
                style={{ boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px' }}
              >
                <Card.Body>
                  <Card.Title>
                    <h3>Call our hotline.</h3>
                  </Card.Title>
                  <Card.Text>24 hours, 7 days a week.</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Row className='w-100'>
                    <Col
                      style={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}
                    >
                      <FaPhone
                        style={{ marginRight: 5, width: 20, height: '100%' }}
                      />
                      <Card.Text>(09)-123-4567-89</Card.Text>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Jumbotron>
      </Row>
    </Col>
  );
}

export default Contact;
