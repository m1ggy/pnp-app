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
    ? '#990000'
    : d > 50
    ? '#d7301f'
    : d > 20
    ? '#ef6548'
    : d > 15
    ? '#fc8d59'
    : d > 10
    ? '#fdbb84'
    : d > 5
    ? '#fdd49e'
    : d > 1
    ? '#fef0d9'
    : '#fff';
};

export default MapLegend;
