import { useEffect, useState } from 'react';
import NavBarMain from '../components/NavBarMain';
import FooterMain from '../components/FooterMain';
import {
  Col,
  Container,
  Image,
  Jumbotron,
  Row,
  Spinner,
} from 'react-bootstrap';
import { firestore } from '../firebase/firebase';
import { Link } from 'react-router-dom';

export default function Events() {
  return (
    <>
      <Col>
        <Row>
          <Container style={{ marginTop: 100 }} />

          <NavBarMain />
        </Row>

        <Row>
          <Jumbotron className='w-100'>
            <h1 className='title'>Events</h1>
          </Jumbotron>
        </Row>

        <Row>
          <Jumbotron className='w-100 mt-2'>
            <Row className='w-100'>
              <Container>
                {loading ? <Spinner animation='border' /> : null}
              </Container>
            </Row>
          </Jumbotron>
        </Row>

        <FooterMain />
      </Col>
    </>
  );
}
