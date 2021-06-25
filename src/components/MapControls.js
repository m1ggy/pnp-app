import React, { useEffect } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import Select from 'react-select';
import { crimeTypes } from '../dashboard utils/constants';
export default function MapControls({ setCrime, crime, map, ...props }) {
  let newCrimeTypes = crimeTypes;

  useEffect(() => {
    newCrimeTypes.push({ label: 'All', value: 'all' });
  }, [newCrimeTypes]);

  return (
    <Row {...props} className='w-100'>
      <Col className='w-100'>
        <Row className='w-100'>
          <h3>Controls</h3>
          <Button
            onClick={() => {
              map.flyTo([14.277, 121.35], 10, {
                animate: true,
                duration: 1,
              });
            }}
            style={{ width: '100%' }}
          >
            Zoom Out
          </Button>
        </Row>
        <Row className='w-100'>
          <div style={{ width: '100%', marginTop: '25px' }}>
            <h4>Filters</h4>
            <Select
              options={newCrimeTypes}
              style={{ zIndex: '999' }}
              defaultValue={{ label: 'All', value: 'all' }}
              value={crime}
              onChange={(e) => {
                setCrime(e);
              }}
            />
          </div>
        </Row>
      </Col>
    </Row>
  );
}
