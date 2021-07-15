import { memo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Col,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap';

const RenderChart = ({ data, header, options }) => {
  const [toggle, setToggle] = useState('line');
  if (data) {
    if (data.datasets) if (data.datasets[0].label == null) return <div></div>;
    if (data.length === 0 && typeof header === 'undefined') {
      return <div></div>;
    } else if (data.length === 0) {
      return (
        <>
          <Container className='mt-5'>
            <h4>{header} has no data.</h4>
          </Container>
        </>
      );
    }

    return (
      <>
        <Container
          className='mt-5 p-3'
          style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
        >
          <div>
            <span style={{ fontWeight: 'bold' }}>Chart Type</span>
          </div>
          <ToggleButtonGroup type='radio' name='Chart Style'>
            <ToggleButton
              onClick={() => {
                setToggle('line');
              }}
              disabled={toggle === 'line' && true}
              variant={toggle === 'line' ? 'success' : 'primary'}
            >
              Line
            </ToggleButton>
            <ToggleButton
              onClick={() => {
                setToggle('bar');
              }}
              disabled={toggle === 'bar' && true}
              variant={toggle === 'bar' ? 'success' : 'primary'}
            >
              Bar
            </ToggleButton>
          </ToggleButtonGroup>
          <Col>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h4>{header}</h4>
            </div>
            {toggle === 'bar' ? (
              <Bar data={data} style={{ width: 350, height: 350 }} />
            ) : toggle === 'line' ? (
              <Line
                data={data}
                style={{ width: 350, height: 350 }}
                options={{
                  tension: 0.3,
                  pointBorderWidth: 1,
                  pointRadius: 3,
                }}
              />
            ) : null}
          </Col>
        </Container>
      </>
    );
  }

  return null;
};

export default memo(RenderChart);
