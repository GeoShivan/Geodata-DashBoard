
export interface FeatureProperties {
  [key: string]: any; // Allow for flexible properties
  VESID?: string;
  'VES ID'?: string;
  Area?: string;
  Location?: string;
  State?: string;
  Easting?: number;
  Northing?: number;
  Slno?: number;
  OBJECTID?: number;
}

export interface PointGeometry {
  type: 'Point';
  coordinates: [number, number, number?]; 
}

export interface Feature {
  type: 'Feature';
  geometry: PointGeometry;
  properties: FeatureProperties;
  id?: number | string;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}
   