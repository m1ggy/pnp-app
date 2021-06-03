import L from 'leaflet';
import { useEffect } from 'react';
import './maps.css';
function MapLegend({ map }) {
  useEffect(() => {
    if (map) {
      const legend = L.control({ position: 'bottomright' });

      const labels = [];
      const levels = [1, 5, 10, 15, 20, 50, 100];

      for (let i = 0; i < 7; i++) {
        labels.push(
          `<i style=background:${colors(levels[i])}></i>> ${levels[i]}`
        );
      }

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = labels.join('<br>');
        return div;
      };

      legend.addTo(map);
    }
  }, [map]); //here add map
  return null;
}

export const colors = (d) => {
  return d > 100
    ? '#99000d'
    : d > 50
    ? '#cb181d'
    : d > 20
    ? '#ef3b2c'
    : d > 15
    ? '#fb6a4a'
    : d > 10
    ? '#fc9272'
    : d > 5
    ? '#fcbba1'
    : d > 1
    ? '#fee0d2'
    : '#fff5f0';
};

export default MapLegend;
