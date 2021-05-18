import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';
import { Col, Row, Jumbotron } from 'react-bootstrap';

function FooterMain() {
  return (
    <Jumbotron className='w-100' style={{ margin: 0 }}>
      <Row className='w-100' className='footer'>
        <p>Copyright 2021 Miguel Buising</p>
      </Row>
      <Row
        className='w-100'
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 25,
        }}
      >
        <Link to='/login'>{'Login'} </Link> {' / '}{' '}
        <a href='https://github.com/m1ggy'>Github</a>
      </Row>
    </Jumbotron>
  );
}

export default FooterMain;
