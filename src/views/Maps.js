import React, { useEffect, useState } from 'react';
import '../styles/map.css';
import { MapContainer, TileLayer, MapConsumer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import { getDataWhereQuery, pageView } from '../utils/firebaseUtils';
import laguna from '../geoJSON/laguna.json';
import GeoJSONMap from '../components/GeoJSONMap';
import MapControls from '../components/MapControls';
import SpinnerPlaceholder from '../components/SpinnerPlaceholder';
import { crimeTypes } from '../dashboard utils/constants';
function Maps() {
  useEffect(() => {
    pageView('webapp');
  }, []);

  /////TODO: Add statistics for entire map on load
  const [map, setMap] = useState();
  const [selectedPane, setSelectedPane] = useState();
  const [data, setData] = useState();
  const [crime, setCrime] = useState();
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState();
  const [selectedCount, setSelectedCount] = useState(0);
  const [dominantPercentage, setDominantPercentage] = useState({});
  const zoomLevel = 10;

  useEffect(() => {
    function getData(id) {
      setLoading(true);
      getDataWhereQuery(
        'reports',
        'description.municipality.value',
        '==',
        id,
        (res) => {
          setData(res);
          setLoading(false);
        }
      );
    }
    if (selectedPane) {
      getData(selectedPane.value);
    }
  }, [selectedPane]);

  useEffect(() => {
    if (!data) return null;
    if (!crime) return null;
    if (data.length === 0) return setFiltered([]);

    setLoading(true);
    setDominantPercentage(null);
    setSelectedCount(0);
    setFiltered(null);

    function formatData() {
      ///when the user selects all, this code will get the percentage of ALL the crime types
      if (crime.value === 'all') {
        setSelectedCount(data.length);
        let keys = [];
        let temp = [];
        let tempPercentage = [];
        for (let i = 0; i < data.length; i++) {
          keys.push(data[i].description.violation);
        }

        const types = crimeTypes;

        types.forEach((type) => {
          let num = keys.reduce(
            (accu, curr) => (curr.value === type.value ? accu + 1 : accu),
            0
          );
          let percentage = (num / keys.length) * 100;
          temp.push({ type, percent: percentage });
          tempPercentage.push(percentage);
        });

        tempPercentage.sort((a, b) => b - a);

        for (let i = 0; i < temp.length; i++) {
          let num = tempPercentage.find(
            (percent) => percent === temp[i].percent
          );

          temp[i].percent = num;
        }
        setDominantPercentage(temp[0]);
        setFiltered(temp);
        return;
      } else {
        let temp = [];
        let crimeTypeArray = [];
        data.reduce(
          (accu, curr) =>
            curr.description.violation.value === crime.value
              ? (temp.push(curr),
                crimeTypeArray.push(curr.description.violation))
              : accu,
          null
        );

        ////generates the percentage of crime of the selected crime type. demonic code
        for (let i = 0; i < crimeTypeArray.length; i++) {
          let num = data.reduce(
            (accu, curr) =>
              curr.description.violation.value === crimeTypeArray[i].value
                ? accu + 1
                : accu,
            null
          );
          ////set the total count of the selected crime type
          setSelectedCount(num);
          let tempPercentage = (num / data.length) * 100;
          setDominantPercentage({
            percent: tempPercentage,
            type: crimeTypeArray[i],
          });
        }

        setFiltered(temp);
      }
    }

    formatData();
    setLoading(false);
  }, [crime, data]);

  return (
    <Col>
      <Row style={{ marginTop: 150, marginBottom: 50 }}>
        <Jumbotron className='w-100'>
          <h1 className='title'>Map of Laguna</h1>
          <div id='mapid' style={{ display: 'flex' }}>
            <Col className='w-100'>
              <Row>
                <Col className='w-100' xs={12} md={12} lg={3}>
                  <Row>
                    {selectedPane && (
                      <div>
                        <h3>Statistics for {selectedPane.label}</h3>
                      </div>
                    )}
                  </Row>
                  <Row
                    className='border w-100 h-100'
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      {loading ? (
                        <SpinnerPlaceholder />
                      ) : filtered ? (
                        filtered.length === 0 && crime.value === 'all' ? (
                          <p>No crime reports in {selectedPane.label}.</p>
                        ) : filtered.length === 0 ? (
                          <p>
                            No Crimes in {selectedPane.label} with crime type of{' '}
                            {crime.label}
                          </p>
                        ) : (
                          <div
                            style={{ textAlign: 'center', marginTop: '10px' }}
                          >
                            <h1>{selectedCount}</h1>
                            <p>Incidents</p>

                            {dominantPercentage && (
                              <div>
                                <h1 style={{ color: 'red' }}>
                                  {dominantPercentage.percent.toFixed(2)}%
                                </h1>
                                <p>
                                  {dominantPercentage.type.label} Percentage
                                </p>
                              </div>
                            )}
                            {crime.value === 'all' && (
                              <div>
                                {dominantPercentage && (
                                  <h1 style={{ color: 'red' }}>
                                    {dominantPercentage.type.label}
                                  </h1>
                                )}
                                <p>Most dominant crime</p>
                                <Row>
                                  {filtered &&
                                    filtered.map((percentage, index) => {
                                      if (index === 0) return null;
                                      if (index === filtered.length - 1)
                                        return null;
                                      return (
                                        <Col key={index}>
                                          <h2>
                                            {percentage.percent.toFixed(2)}%
                                          </h2>
                                          <p>{percentage.type.label}</p>
                                        </Col>
                                      );
                                    })}
                                </Row>
                              </div>
                            )}
                          </div>
                        )
                      ) : null}
                    </div>
                  </Row>
                </Col>
                <Col xs={12} md={8} lg={6}>
                  <Row>
                    <MapContainer
                      center={[14.277, 121.35]}
                      zoom={zoomLevel}
                      scrollWheelZoom={false}
                      zoomControl={false}
                      dragging={false}
                      style={{
                        height: '600px',
                        minWidth: '100%',
                        margin: 'auto',
                        zIndex: 1,
                      }}
                      doubleClickZoom={false}
                      whenCreated={setMap}
                    >
                      <MapConsumer>
                        {(map) => {
                          return (
                            <GeoJSONMap
                              data={laguna}
                              path={{ color: 'green', weight: 1 }}
                              map={map}
                              selector={setSelectedPane}
                            />
                          );
                        }}
                      </MapConsumer>
                      <TileLayer
                        url='https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=89WuphSbH8Ve5snRY7jsFAlgJwwBc3qNxH6U6x7uyzcPQWzn7JwqWiMsHh9x1qJg'
                        draggable={false}
                        attribution={
                          '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors'
                        }
                      />
                    </MapContainer>
                  </Row>
                </Col>
                <Col className='w-100'>
                  {map && (
                    <MapControls
                      map={map}
                      style={{ margin: '25px' }}
                      crime={crime}
                      setCrime={setCrime}
                    />
                  )}
                </Col>
              </Row>
            </Col>
          </div>
        </Jumbotron>
      </Row>
    </Col>
  );
}
export default Maps;
