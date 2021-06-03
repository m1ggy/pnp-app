import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import '../styles/map.css';
import laguna from '../geoJSON/laguna.json';
import { municipalities } from '../dashboard utils/constants';
import { Col, Row, Jumbotron } from 'react-bootstrap';
import L from 'leaflet';
import { getDataFromCollection } from '../utils/firebaseUtils';
import MapLegend, { colors } from './MapLegend';

export default function Map() {
  const [reports, setReports] = useState();
  const [map, setMap] = useState();
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
            (prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev),
            {}
          );
          console.log(frequency);
          setCount(frequency);
          //   setCount('test');
        }
      }

      setReports(res);
    });
  }, []);

  function onEachProvince(province, layer) {
    let municipality;

    // count.forEach((municipality)=>{
    //     if(province.properties.MUNICIPALI ===Object.keys(municipality))
    // })

    const keys = Object.keys(count);

    keys.forEach((key) => {
      if (province.properties.MUNICIPALI === key) {
        console.log(count[`${key}`]);
        layer.setStyle({
          color: colors(count[`${key}`]),
          fillColor: colors(count[`${key}`]),
          weight: 0.5,
        });
      }
    });

    municipalities.forEach((place) => {
      if (place.value === province.properties.MUNICIPALI) {
        if (count)
          if (count.hasOwnProperty(`${place.value}`)) {
            return (municipality = popupHTMLbody(
              place,
              count[`${place.value}`]
            ));
          }

        return (municipality = popupHTMLbody(place));
      }
    });

    layer.bindPopup(municipality, {
      closeButton: false,
      offset: L.point(0, 20),
    });
    layer.on('mouseover', function () {
      layer.openPopup();
    });
    layer.on('mouseout', function () {
      layer.closePopup();
    });
  }

  function popupHTMLbody(place, data) {
    if (data == null)
      return `<div>
    <h6>${place.label}</h6>
    </div>`;

    return `<div>
                <h6>${place.label}</h6>
                Reports:${data}
            </div>`;
  }

  return (
    <Col>
      <Row>
        <Jumbotron className='w-100'>
          <h1>Crime Map</h1>
        </Jumbotron>
      </Row>
      <Row>
        <Jumbotron className='w-100'>
          <div id='mapid' style={{ display: 'flex' }}>
            {count && (
              <MapContainer
                center={[14.277, 121.35]}
                zoom={11}
                scrollWheelZoom={false}
                zoomControl={false}
                dragging={false}
                style={{ height: '1000px', width: '100%', margin: 'auto' }}
                doubleClickZoom={false}
                whenCreated={setMap}
              >
                <GeoJSON
                  data={laguna}
                  pathOptions={{
                    color: `green`,
                    opacity: 1,
                    weight: 1,
                  }}
                  onEachFeature={onEachProvince}
                />
                <MapLegend map={map} />
                <TileLayer
                  url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                  draggable={false}
                />
              </MapContainer>
            )}
          </div>
        </Jumbotron>
      </Row>
    </Col>
  );
}
