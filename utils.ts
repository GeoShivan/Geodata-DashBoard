import { Feature } from './types';

export const getFeatureId = (feature: Feature | null): string => {
  if (!feature) return 'none';
  const vesId = feature.properties.VESID || feature.properties['VES ID'];
  const uniquePart = feature.id ?? feature.properties.OBJECTID ?? feature.properties.Slno ?? '';
  const coords = feature.geometry.coordinates || [];
  return `${vesId}-${uniquePart}-${coords.join(',')}`;
};
