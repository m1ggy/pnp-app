import React from 'react';
import { Col, Row, Container, Jumbotron, Nav } from 'react-bootstrap';
import NavBarMain from '../components/NavBarMain';
import FooterMain from '../components/FooterMain';

function Contact() {
  return (
    <>
      <Row>
        <NavBarMain />
      </Row>
      <Row>
        <Container style={{ marginTop: 100 }} />
      </Row>
      <Row>
        <Jumbotron className='w-100 mt-2'>
          <h1>Contact</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          <Col>
            <Row className='border' lg={4}>
              <p>Hello</p>
            </Row>
            <Row className='border' lg={4}>
              <p>Hello</p>
            </Row>
            <Row className='border' lg={4}>
              <p>Hello</p>
            </Row>
          </Col>
        </Jumbotron>
      </Row>

      <Row>
        <FooterMain />
      </Row>
    </>
  );
}

export default Contact;
