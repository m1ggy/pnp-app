import { GeoJSON } from 'react-leaflet';
import React from 'react';
import { municipalities } from '../dashboard utils/constants';
import L from 'leaflet';

export default function GeoJSONMap({ data, path, map, selector }) {
  function onEachProvince(province, layer) {
    const currentMunicipality = municipalities.find(
      (item) => item.value === province.properties.MUNICIPALI
    );
    const municipality = `<h2>${currentMunicipality.label}</h2>`;
    layer.bindPopup(municipality, {
      closeButton: false,
      offset: L.point(0, 5),
    });
    layer.on('click', (e) => {
      selector(currentMunicipality);
      map.fitBounds(e.target._bounds, {
        animate: true,
        duration: 1,
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

  return (
    <GeoJSON data={data} pathOptions={path} onEachFeature={onEachProvince} />
  );
}
