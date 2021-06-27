import React, { useEffect, useState } from 'react';
import '../styles/map.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import {
  getDataWhereQuery,
  pageView,
  getDataFromCollection,
} from '../utils/firebaseUtils';
import laguna from '../geoJSON/laguna.json';
import GeoJSONMap from '../components/GeoJSONMap';
import MapControls from '../components/MapControls';
import SpinnerPlaceholder from '../components/SpinnerPlaceholder';
import { crimeTypes, municipalities } from '../dashboard utils/constants';
import CommunityMapLegend from '../components/CommunityMapLegend';
import { colors } from '../components/MapLegend';
import L from 'leaflet';

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

  const [dominantPercentage, setDominantPercentage] = useState({});
  const zoomLevel = 10;
  const [count, setCount] = useState();
  ////get all reports
  useEffect(() => {
    getDataFromCollection('reports', (res) => {
      const count = [];
      if (res) {
        if (res.length > 0) {
          res.forEach((report) => {
            const matched = municipalities.find(
              (element) =>
                element.value === report.description.municipality.value
            );
            count.push(matched.value);
          });

          const frequency = count.reduce(
            (prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev), // eslint-disable-line no-sequences
            {}
          );
          setCount(frequency);
        }
      }
    });
  }, []);

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
  function onEachProvince(province, layer) {
    const keys = Object.keys(count);
    keys.forEach((key) => {
      if (province.properties.MUNICIPALI === key) {
        layer.setStyle({
          color: colors(count[`${key}`]),
          fillColor: colors(count[`${key}`]),
          weight: 0.5,
        });
      }
    });
    const currentMunicipality = municipalities.find(
      (item) => item.value === province.properties.MUNICIPALI
    );
    const municipality = `<h2>${currentMunicipality.label}</h2>`;
    layer.bindPopup(municipality, {
      closeButton: false,
      offset: L.point(0, 5),
    });
    layer.on('click', (e) => {
      setSelectedPane(currentMunicipality);

      map.fitBounds(e.target._bounds, {
        animate: true,
        duration: 1,
        easeLinearity: 0.5,
      });
    });
    layer.on('mouseover', () => {
      layer.setStyle({
        color: 'blue',
      });
    });
    layer.on('mouseout', () => {
      layer.setStyle({
        color: `green`,
      });
    });
  }

  useEffect(() => {
    if (data == null) return null;
    if (crime == null) return null;
    if (data.length === 0) return setFiltered([]);

    setLoading(true);
    setDominantPercentage(null);

    setFiltered([]);

    function formatData() {
      ///when the user selects all, this code will get the percentage of ALL the crime types
      if (crime.value === 'all') {
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
        let tempData = [...data];
        tempData.reduce(
          (accu, curr) =>
            curr.description.violation.value === crime.value
              ? (temp.push(curr),
                crimeTypeArray.push(curr.description.violation))
              : accu,
          null
        );

        ////generates the percentage of crime of the selected crime type. demonic code
        for (let i = 0; i < crimeTypeArray.length; i++) {
          let num = tempData.reduce(
            (accu, curr) =>
              curr.description.violation.value === crimeTypeArray[i].value
                ? accu + 1
                : accu,
            null
          );
          ////set the total count of the selected crime type

          let tempPercentage = (num / tempData.length) * 100;
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
                    className='w-100 h-100'
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div>
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
                            style={{
                              textAlign: 'center',
                              marginTop: '10px',
                            }}
                          >
                            {dominantPercentage && (
                              <div>
                                <h1 style={{ color: 'red' }}>
                                  {dominantPercentage.percent.toFixed(2)}%
                                </h1>
                                <p>
                                  of all crimes in {selectedPane.label} are{' '}
                                  <span
                                    style={{ fontWeight: 'bold', color: 'red' }}
                                  >
                                    {dominantPercentage.type.label}
                                  </span>
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
                                  {filtered.length > 0
                                    ? filtered.map((percentage, index) => {
                                        if (index === 0) return null;
                                        if (index === filtered.length - 1)
                                          return null;
                                        return (
                                          <Col key={index}>
                                            <h2>
                                              {percentage.percent
                                                ? `${percentage.percent.toFixed(
                                                    2
                                                  )}%`
                                                : '0%'}
                                            </h2>
                                            <p>
                                              {percentage.type &&
                                                `${percentage.type.label}`}
                                            </p>
                                          </Col>
                                        );
                                      })
                                    : null}
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
                    {count && (
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
                        touchZoom={false}
                        doubleClickZoom={false}
                        whenCreated={setMap}
                        placeholder={<SpinnerPlaceholder />}
                      >
                        <CommunityMapLegend map={map} />

                        {map && (
                          <GeoJSONMap
                            data={laguna}
                            path={{ color: 'green', weight: 1 }}
                            onEachFeature={onEachProvince}
                          />
                        )}

                        <TileLayer
                          url='https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=89WuphSbH8Ve5snRY7jsFAlgJwwBc3qNxH6U6x7uyzcPQWzn7JwqWiMsHh9x1qJg'
                          draggable={false}
                          attribution={
                            '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors'
                          }
                        />
                      </MapContainer>
                    )}
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
