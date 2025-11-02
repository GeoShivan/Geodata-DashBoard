
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
  const coords = feature.geometry.coordinates || [];
  return `${vesId}-${coords.join(',')}`;
};

const COLOR_PALETTE = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];


const MapDashboard: React.FC<MapDashboardProps> = ({ data, selectedFeature, onFeatureSelect }) => {
  const mapCenter: LatLngExpression = data.features.length > 0
    ? [data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]]
    : [20.5937, 78.9629];
  
  const { groupedByState, stateColorMap } = React.useMemo(() => {
    const groups: { [key: string]: Feature[] } = {};
    // FIX: Explicitly convert state property to string to avoid type errors when using it as an index key.
    const uniqueStates = [...new Set(data.features.map(f => (String(f.properties.State || '').trim()) || 'Unknown State'))].sort();
    
    const colorMap: { [key: string]: string } = {};
    uniqueStates.forEach((state, index) => {
        colorMap[state] = COLOR_PALETTE[index % COLOR_PALETTE.length];
    });

    for (const feature of data.features) {
      // FIX: Explicitly convert state property to string to resolve the "Type 'unknown' cannot be used as an index type" error.
      const state = (String(feature.properties.State || '').trim()) || 'Unknown State';
      if (!groups[state]) {
        groups[state] = [];
      }
      groups[state].push(feature);
    }
    return { groupedByState: groups, stateColorMap: colorMap };
  }, [data]);
  
  const pointToLayer = (feature: Feature, latlng: L.LatLng): L.Layer => {
    const isSelected = selectedFeature && getFeatureId(feature) === getFeatureId(selectedFeature);
    // FIX: Explicitly convert state property to string for type safety and consistency.
    const state = (String(feature.properties.State || '').trim()) || 'Unknown State';
    const stateColor = stateColorMap[state] || '#cccccc';

    return L.circleMarker(latlng, {
      radius: isSelected ? 10 : 6,
      fillColor: isSelected ? '#a3e635' : stateColor, // lime-400 for selected
      color: isSelected ? '#a3e635' : '#111827',
      weight: isSelected ? 3 : 1,
      opacity: 1,
      fillOpacity: isSelected ? 1 : 0.8,
    });
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const { properties, geometry } = feature;
    const vesId = properties.VESID || properties['VES ID'] || 'N/A';
    const location = properties.Location || 'N/A';
    const area = properties.Area || 'N/A';
    // FIX: Explicitly convert state property to string for type safety and consistency.
    const state = (String(properties.State || '').trim()) || 'N/A';
    const [lon, lat] = geometry.coordinates;

    const tooltipContent = `<div class="font-sans"><b>ID:</b> ${vesId}<br/><b>Location:</b> ${location}</div>`;
    layer.bindTooltip(tooltipContent);

    const popupContent = `
      <div class="w-56 p-0 font-sans text-gray-200">
        <div class="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-lg p-2">
          <h3 class="font-bold text-md text-white">
            Point ${vesId}
          </h3>
        </div>
        <dl class="text-xs p-2">
          <div class="flex justify-between py-1.5">
            <dt class="font-medium text-gray-400">Location:</dt>
            <dd class="font-semibold truncate">${location}</dd>
          </div>
          <div class="flex justify-between py-1.5">
            <dt class="font-medium text-gray-400">Area:</dt>
            <dd class="font-semibold truncate">${area}</dd>
          </div>
          <div class="flex justify-between py-1.5">
            <dt class="font-medium text-gray-400">State:</dt>
            <dd class="font-semibold truncate">${state}</dd>
          </div>
          <div class="flex justify-between py-1.5 mt-1 border-t border-white/10">
            <dt class="font-medium text-gray-400">Coords:</dt>
            <dd class="font-mono text-lime-400">${lat.toFixed(4)}, ${lon.toFixed(4)}</dd>
          </div>
        </dl>
      </div>
    `;
    layer.bindPopup(popupContent, { minWidth: 220 });
    
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
    <div className="w-full h-full relative" style={{ minHeight: '300px' }}>
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
                key={`${state}-${getFeatureId(selectedFeature)}`} 
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
