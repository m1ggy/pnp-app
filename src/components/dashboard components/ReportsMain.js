import React, { useEffect, useState } from 'react';
import { Col, Row, Jumbotron } from 'react-bootstrap';
import { getDataFromCollection } from '../../utils/firebaseUtils';
import RenderReports from '../RenderReports';
export default function ReportsMain() {
  const [data, setData] = useState();

  useEffect(() => {
    getDataFromCollection('reports', (res) => {
      console.log(res);
      setData(res);
    });
  }, []);

  return (
    <Col>
      <Row>
        <Jumbotron className='w-100'>
          <h1>Reports</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          <RenderReports data={data} />
        </Jumbotron>
      </Row>
    </Col>
  );
}
