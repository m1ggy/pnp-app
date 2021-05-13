import React from 'react';
import { Line } from 'react-chartjs-2';
import { Col, Container } from 'react-bootstrap';

export default function RenderChart({ data, header, options }) {
  return (
    <>
      <Container style={{ width: 750 }} className='mt-5'>
        <Col>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h4>{header}</h4>
          </div>
          <Line data={data} options={options} />
        </Col>
      </Container>
    </>
  );
}
