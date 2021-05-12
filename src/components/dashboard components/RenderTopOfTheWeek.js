import React from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
export default function RenderTopOfTheWeek({ data, header }) {
  if (data === null || typeof data === undefined) {
    return (
      <>
        <p>no data this week.</p>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <>
        <p>no data this week.</p>
      </>
    );
  }

  console.log(data);

  return data.map((item) => {
    return (
      <ListGroup.Item key={item.label}>
        <Col>
          <Row style={{ display: 'flex', justifyContent: 'center' }}>
            {' '}
            <h5>{item.label}</h5>
          </Row>
          <Row style={{ display: 'flex', justifyContent: 'center' }}>
            {' '}
            <p>
              {item.count} {header === 'Downloads' ? `downloads` : `views`}
            </p>
          </Row>
        </Col>
      </ListGroup.Item>
    );
  });
}
