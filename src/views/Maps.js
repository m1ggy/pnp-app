import React from 'react';
import '../styles/map.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { Row, Col } from 'react-bootstrap';

function Maps() {
  return (
    <Col>
      <Row style={{ marginTop: 150, marginBottom: 50 }}>
        {' '}
        <h1 className='title'>Maps</h1>
      </Row>

      <div id='mapid' style={{ display: 'flex' }}>
        <MapContainer
          center={[14.1407, 121.4692]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '500px', width: '800px', margin: 'auto' }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            draggable={false}
          />
          <Marker position={[14.1407, 121.4692]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </Col>
  );
}
export default Maps;
