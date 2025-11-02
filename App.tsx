
import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import MapDashboard from './components/MapDashboard';
import FilterPanel from './components/FilterPanel';
import Sidebar from './components/Sidebar';
import { surveyData } from './data/surveyData';
import { Feature, FeatureCollection } from './types';

function App() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const cleanedData: FeatureCollection = useMemo(() => {
    const validFeatures = surveyData.features.filter(feature => 
        feature &&
        feature.geometry &&
        feature.geometry.type === 'Point' &&
        Array.isArray(feature.geometry.coordinates) &&
        feature.geometry.coordinates.length >= 2 &&
        typeof feature.geometry.coordinates[0] === 'number' &&
        typeof feature.geometry.coordinates[1] === 'number'
    );
    return { ...surveyData, features: validFeatures };
  }, []);

  const filteredData = useMemo(() => {
    let features = cleanedData.features;

    if (stateFilter !== 'all') {
      features = features.filter(f => f.properties.State?.trim() === stateFilter);
    }
    if (locationFilter !== 'all') {
      features = features.filter(f => f.properties.Location?.trim() === locationFilter);
    }
    
    return { ...cleanedData, features };
  }, [cleanedData, stateFilter, locationFilter]);

  // Reset selected feature if it's no longer in the filtered data
  React.useEffect(() => {
    if (selectedFeature && !filteredData.features.some(f => (f.properties.VESID || f.properties['VES ID']) === (selectedFeature.properties.VESID || selectedFeature.properties['VES ID']))) {
      setSelectedFeature(null);
    }
  }, [filteredData, selectedFeature]);

  const clearFilters = useCallback(() => {
    setStateFilter('all');
    setLocationFilter('all');
  }, []);


  return (
    <div className="flex flex-col h-screen aurora-bg font-sans text-gray-200">
      <Header />
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full glassmorphism rounded-2xl shadow-2xl flex flex-col p-4">
          <FilterPanel 
            allData={cleanedData}
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            onClearFilters={clearFilters}
          />
          <div className="flex-1 overflow-y-auto mt-4 pr-1">
            <Sidebar 
              selectedFeature={selectedFeature} 
              allData={cleanedData}
              filteredData={filteredData} 
            />
          </div>
        </aside>

        <main className="flex-1 h-full w-full rounded-2xl overflow-hidden shadow-2xl">
          <MapDashboard 
            data={filteredData} 
            selectedFeature={selectedFeature}
            onFeatureSelect={setSelectedFeature} 
          />
        </main>
      </div>
    </div>
  );
}

export default App;
