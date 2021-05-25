import React from 'react';
import { Col, Row, Jumbotron } from 'react-bootstrap';
export default function ReportsMain() {
  return (
    <Col>
      <Row>
        <Jumbotron className='w-100'>
          <h1>Reports</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'></Jumbotron>
      </Row>
    </Col>
  );
}
