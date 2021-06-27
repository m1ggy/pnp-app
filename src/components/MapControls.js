import React, { useEffect, useMemo } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import Select from 'react-select';
import { crimeTypes } from '../dashboard utils/constants';

export default function MapControls({ setCrime, crime, map, ...props }) {
  let newCrimeTypes = crimeTypes;

  let all = useMemo(() => createAllSelector(), []);

  function createAllSelector() {
    return { label: 'All', value: 'all' };
  }

  useEffect(() => {
    newCrimeTypes.push(all);
    console.log(all);
  }, [newCrimeTypes, all]);

  useEffect(() => {
    setCrime(all);
    //eslint-disable-next-line
  }, []);

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
                easeLinearity: 1,
              });
              setCrime(all);
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
