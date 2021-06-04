import React, { useEffect } from 'react';
import '../styles/map.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
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
    const municipality = `<h6>${province.properties.MUNICIPALI}</h6>`;

    layer.bindPopup(municipality, {
      closeButton: false,
      offset: L.point(0, 5),
    });
    layer.on('mouseover', function () {
      layer.openPopup();
    });
    layer.on('mouseout', function () {
      layer.closePopup();
    });
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
              style={{ height: '1000px', width: '100%', margin: 'auto' }}
              doubleClickZoom={false}
            >
              <GeoJSON
                data={laguna}
                pathOptions={{ color: 'green', weight: 1 }}
                onEachFeature={onEachProvince}
              />

              <TileLayer
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
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
