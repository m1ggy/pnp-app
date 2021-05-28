import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Col, Container, Spinner } from 'react-bootstrap';

export default function RenderChart({ data, header, options, percentage }) {
  if (data) {
    if (data.length === 0 && typeof header === 'undefined') {
      return (
        <div>
          <Spinner animation='grow' />
        </div>
      );
    } else if (data.length === 0) {
      return (
        <React.Fragment>
          <Container className='mt-5 border'>
            <h4>{header} has no data.</h4>
          </Container>
        </React.Fragment>
      );
    }
  }

  return (
    <React.Fragment>
      <Container
        className='mt-5 p-3'
        style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
      >
        <Col>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h4>{header}</h4>
          </div>
          <Bar
            data={data}
            options={options}
            style={{ width: 350, height: 350 }}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {percentage && (
              <React.Fragment>
                {percentage.label === 'red' ? (
                  <p>
                    Down by{' '}
                    <span style={{ color: `${percentage.label}` }}>-</span>
                  </p>
                ) : percentage.label === 'green' ? (
                  <p>
                    Up by{' '}
                    <span style={{ color: `${percentage.label}` }}>+</span>
                  </p>
                ) : null}

                <p
                  style={{
                    color: `${percentage.label}`,
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}
                >
                  {percentage.data}%
                </p>
              </React.Fragment>
            )}
          </div>
        </Col>
      </Container>
    </React.Fragment>
  );
}
