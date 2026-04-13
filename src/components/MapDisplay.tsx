import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapLocation {
  lat: number;
  lng: number;
  name: string;
  day: number;
  time: string;
}

interface MapDisplayProps {
  locations: MapLocation[];
  center?: [number, number];
}

// Component to handle map view updates
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const MapDisplay: React.FC<MapDisplayProps> = ({ locations, center }) => {
  // Calculate center if not provided
  const mapCenter: [number, number] = center || (locations.length > 0 
    ? [locations[0].lat, locations[0].lng] 
    : [0, 0]);

  if (locations.length === 0) return null;

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-surface-container-highest shadow-sm mb-8 z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={mapCenter} zoom={12} />
        {locations.map((loc, idx) => (
          <Marker key={`${loc.lat}-${loc.lng}-${idx}`} position={[loc.lat, loc.lng]}>
            <Popup>
              <div className="p-1">
                <p className="font-bold text-primary text-xs uppercase tracking-widest mb-1">Day {loc.day} • {loc.time}</p>
                <p className="font-medium text-sm">{loc.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
