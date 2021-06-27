import { GeoJSON } from 'react-leaflet';

export default function GeoJSONMap({ data, path, ...props }) {
  return <GeoJSON data={data} pathOptions={path} {...props} />;
}
