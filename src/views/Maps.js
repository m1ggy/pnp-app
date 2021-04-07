import React from 'react'
import '../styles/map.css'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Maps (){
    return(
    <div className="container">
        <div>
            <h1 className="title">Maps</h1>
        </div>
        
        <div id="mapid" style={{display:'flex'}}>
            <MapContainer center={[14.1407, 121.4692]} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '800px', margin:'auto' }}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[14.1407, 121.4692]}>
                    <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
        </MapContainer>
        </div>
    </div>
    )
}
export default Maps