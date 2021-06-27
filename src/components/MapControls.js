import React, { useEffect, useMemo } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import Select from 'react-select';
import { crimeTypes } from '../dashboard utils/constants';
import '../styles/mapControls.css';
export default function MapControls({
  setCrime,
  crime,
  map,
  selector,
  ...props
}) {
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
        <Row className='w-100' style={{ minHeight: '200px' }}>
          <h3>Controls</h3>
          <Button
            className='MapButton'
            onClick={() => {
              map.flyTo([14.277, 121.35], 10, {
                animate: true,
                duration: 1,
                easeLinearity: 1,
              });
            }}
          >
            Zoom Out
          </Button>
          <Button
            onClick={() => {
              selector({ label: 'Laguna', value: 'laguna' });
              map.flyTo([14.277, 121.35], 10, {
                animate: true,
                duration: 1,
                easeLinearity: 1,
              });
            }}
            className='MapButton'
          >
            Show Entire Laguna
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
