import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { Feature } from '../types';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon for the selected point for better visibility
const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


interface MiniMapProps {
  feature: Feature;
}

// Component to handle map view changes
const ChangeView: React.FC<{ center: LatLngExpression; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [map, center, zoom]);
    return null;
}

const MiniMap: React.FC<MiniMapProps> = ({ feature }) => {
  if (!feature || !feature.geometry) {
    return null;
  }

  const [lon, lat] = feature.geometry.coordinates;
  const position: LatLngExpression = [lat, lon];
  const mapRef = useRef<L.Map | null>(null);

  // Invalidate map size after it becomes visible to ensure it renders correctly
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [feature]);

  return (
    <div className="h-48 w-full rounded-lg overflow-hidden border border-white/10 mb-4 shadow-inner">
      <MapContainer
        whenCreated={map => mapRef.current = map}
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        dragging={true}
        style={{ height: '100%', width: '100%', backgroundColor: '#111827' }}
      >
        <ChangeView center={position} zoom={14} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={selectedIcon} />
      </MapContainer>
    </div>
  );
};

export default MiniMap;
