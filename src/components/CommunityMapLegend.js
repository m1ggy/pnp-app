import { useEffect } from 'react';
import './maps.css';
import L from 'leaflet';
import { colors } from './MapLegend';
export default function CommunityMapLegend({ map }) {
  useEffect(() => {
    if (map) {
      const legend = L.control({ position: 'bottomright' });

      const labels = ['<p>Severity</p>'];
      const levels = [1, 5, 10, 15, 20, 50, 100];

      for (let i = 0; i < 7; i++) {
        labels.push(`<i style=background:${colors(levels[i])}></i>`);
      }

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = labels.join('<br>');
        return div;
      };

      legend.addTo(map);
    }
  }, [map]);
  return null;
}
