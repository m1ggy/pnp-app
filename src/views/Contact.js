import React, { useEffect } from 'react';
import { Col, Row, Jumbotron, Card } from 'react-bootstrap';
import { pageView } from '../utils/firebaseUtils';

import { FaFacebookMessenger, FaTwitter, FaPhone } from 'react-icons/fa';

function Contact() {
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
            <Col lg={6}>
              <Card
                className='text-center'
                style={{
                  boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px',
                  margin: 20,
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <h3>Message us on social media.</h3>
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
            <Col lg={6}>
              <Card
                className='text-center'
                style={{
                  boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px',
                  margin: 20,
                }}
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
