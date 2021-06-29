import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Col, Container } from 'react-bootstrap';

const RenderChart = ({ data, header, options }) => {
  if (data) {
    if (data.datasets) if (data.datasets[0].label == null) return <div></div>;
    if (data.length === 0 && typeof header === 'undefined') {
      return <div></div>;
    } else if (data.length === 0) {
      return (
        <React.Fragment>
          <Container className='mt-5'>
            <h4>{header} has no data.</h4>
          </Container>
        </React.Fragment>
      );
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
          </Col>
        </Container>
      </React.Fragment>
    );
  }

  return null;
};

export default React.memo(RenderChart);
