import React from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import L, { LatLngExpression, Layer, LeafletMouseEvent } from 'leaflet';
import { Feature, FeatureCollection } from '../types';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapDashboardProps {
  data: FeatureCollection;
  selectedFeature: Feature | null;
  onFeatureSelect: (feature: Feature) => void;
}

const getFeatureId = (feature: Feature | null): string => {
  if (!feature) return 'none';
  const vesId = feature.properties.VESID || feature.properties['VES ID'];
  // Create a composite key for better uniqueness, handling potential nulls
  const coords = feature.geometry.coordinates || [];
  return `${vesId}-${coords.join(',')}`;
};

const MapDashboard: React.FC<MapDashboardProps> = ({ data, selectedFeature, onFeatureSelect }) => {
  const mapCenter: LatLngExpression = data.features.length > 0
    ? [data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]]
    : [20.5937, 78.9629];
  
  const groupedByState = React.useMemo(() => {
    const groups: { [key: string]: Feature[] } = {};
    for (const feature of data.features) {
      const state = feature.properties.State?.trim().replace(/\s+/g, ' ') || 'Unknown State';
      if (!groups[state]) {
        groups[state] = [];
      }
      groups[state].push(feature);
    }
    return groups;
  }, [data]);
  
  const pointToLayer = (feature: Feature, latlng: L.LatLng): L.Layer => {
    const isSelected = selectedFeature && getFeatureId(feature) === getFeatureId(selectedFeature);
    return L.circleMarker(latlng, {
      radius: isSelected ? 10 : 6,
      fillColor: isSelected ? '#ef4444' : '#22d3ee', // red-500, cyan-400
      color: '#000',
      weight: isSelected ? 2 : 1,
      opacity: 1,
      fillOpacity: isSelected ? 1 : 0.8,
    });
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const vesId = feature.properties.VESID || feature.properties['VES ID'] || 'N/A';
    const location = feature.properties.Location || 'Unknown Location';
    layer.bindTooltip(`<b>VES ID:</b> ${vesId}<br/><b>Location:</b> ${location}`);
    
    layer.on({
      click: (e: LeafletMouseEvent) => {
        onFeatureSelect(feature);
        
        const map = e.target._map;
        if (map && feature.geometry.type === 'Point') {
          const [lon, lat] = feature.geometry.coordinates;
          map.flyTo([lat, lon], 14, {
            animate: true,
            duration: 1,
          });
        }
      },
    });
  };

  return (
    <div className="w-full h-full" style={{ minHeight: '300px' }}>
      <MapContainer center={mapCenter} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%', backgroundColor: '#111827' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="CartoDB (Dark)">
             <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>

          {Object.entries(groupedByState).map(([state, features]) => (
            <LayersControl.Overlay key={state} name={state} checked>
              <GeoJSON
                key={`${state}-${getFeatureId(selectedFeature)}`} // Re-render when selection changes to update style
                data={{ type: 'FeatureCollection', features } as FeatureCollection}
                pointToLayer={pointToLayer}
                onEachFeature={onEachFeature}
              />
            </LayersControl.Overlay>
          ))}
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default MapDashboard;
