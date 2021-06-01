import React, { useEffect } from 'react';
import '../styles/map.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import { pageView } from '../utils/firebaseUtils';
import laguna from '../geoJSON/laguna.json';

function Maps() {
  useEffect(() => {
    pageView('webapp');
  }, []);

  function onEachProvince(province, layer) {
    const municipality = province.properties.MUNICIPALI;

    layer.bindPopup(municipality);
  }

  return (
    <Col>
      <Row style={{ marginTop: 150, marginBottom: 50 }}>
        <Jumbotron className='w-100'>
          <h1 className='title'>Maps</h1>
          <div id='mapid' style={{ display: 'flex' }}>
            <MapContainer
              center={[14.277, 121.35]}
              zoom={10}
              scrollWheelZoom={false}
              zoomControl={false}
              dragging={false}
              style={{ height: '500px', width: '800px', margin: 'auto' }}
              doubleClickZoom={false}
            >
              <GeoJSON
                data={laguna}
                pathOptions={{ color: 'blue' }}
                onEachFeature={onEachProvince}
              />

              <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                draggable={false}
              />
            </MapContainer>
          </div>
        </Jumbotron>
      </Row>
    </Col>
  );
}
export default Maps;
