import React, { useMemo } from 'react';
import { FeatureCollection } from '../types';

interface FilterPanelProps {
  allData: FeatureCollection;
  stateFilter: string;
  setStateFilter: (state: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  allData, 
  stateFilter, 
  setStateFilter, 
  locationFilter,
  setLocationFilter 
}) => {

  const { uniqueStates, locationsInState } = useMemo(() => {
    const states = new Set<string>();
    const locations = new Set<string>();
    let dataToScan = allData.features;

    allData.features.forEach(f => {
      if (f.properties.State) states.add(f.properties.State.trim());
    });

    if (stateFilter !== 'all') {
      dataToScan = allData.features.filter(f => f.properties.State?.trim() === stateFilter);
    }
    
    dataToScan.forEach(f => {
      if (f.properties.Location) locations.add(f.properties.Location.trim());
    });

    return { 
      uniqueStates: Array.from(states).sort(),
      locationsInState: Array.from(locations).sort()
    };
  }, [allData, stateFilter]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStateFilter(e.target.value);
    setLocationFilter('all'); // Reset location when state changes
  };

  const selectStyle = "w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 placeholder-gray-400";

  return (
    <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-2">Filters</h3>
      <div>
        <label htmlFor="state-filter" className="block mb-2 text-sm font-medium text-gray-300">State</label>
        <select 
          id="state-filter" 
          className={selectStyle}
          value={stateFilter}
          onChange={handleStateChange}
        >
          <option value="all">All States</option>
          {uniqueStates.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="location-filter" className="block mb-2 text-sm font-medium text-gray-300">Location</label>
        <select 
          id="location-filter"
          className={selectStyle}
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          disabled={stateFilter === 'all' && locationsInState.length === 0}
        >
          <option value="all">All Locations</option>
          {locationsInState.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
