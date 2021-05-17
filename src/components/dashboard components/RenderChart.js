import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Col, Container } from 'react-bootstrap';

export default function RenderChart({ data, header, options }) {
  if (data) {
    if (data.length === 0) {
      return (
        <>
          <Container className='mt-5 border'>
            <h4>{header} has no data.</h4>
          </Container>
        </>
      );
    }
  }
  return (
    <>
      <Container className='mt-5 border'>
        <Col>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h4>{header}</h4>
          </div>
          <Bar
            data={data}
            options={options}
            style={{ width: 350, height: 350 }}
          />
        </Col>
      </Container>
    </>
  );
}
