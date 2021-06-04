import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';
import { Row, Jumbotron } from 'react-bootstrap';
import { DiGithubBadge } from 'react-icons/di';

function FooterMain() {
  return (
    <Jumbotron className='w-100 ' style={{ margin: 0 }}>
      <Row
        className='w-100 '
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Link to='/login'>{'Login'} </Link>
      </Row>
      <Row
        className='w-100'
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={{ fontSize: 10 }}>
          Copyright 2021 Miguel Buising{' '}
          <a href='https://github.com/m1ggy'>
            <DiGithubBadge style={{ height: '100%', width: 20 }} />
          </a>
        </p>
      </Row>
    </Jumbotron>
  );
}

export default FooterMain;
