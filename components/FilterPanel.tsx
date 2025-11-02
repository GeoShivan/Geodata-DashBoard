
import React, { useState, useMemo } from 'react';
import { FeatureCollection } from '../types';

interface FilterPanelProps {
  allData: FeatureCollection;
  stateFilter: string;
  setStateFilter: (state: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  allData, 
  stateFilter, 
  setStateFilter, 
  locationFilter,
  setLocationFilter,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(true);

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

  const selectStyle = "w-full bg-gray-900/50 border border-white/10 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 placeholder-gray-400 custom-select";

  return (
    <div className="border-b border-white/10 pb-4">
      <div className="flex items-center justify-between">
         <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex-grow flex items-center justify-between text-left text-lg font-semibold text-gray-100 px-1 py-1 rounded-md hover:bg-white/5 transition-colors duration-200"
            aria-expanded={isOpen}
            aria-controls="filter-content"
          >
            <span>Filters</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <button
              onClick={onClearFilters}
              className="ml-2 text-xs text-gray-400 hover:text-cyan-400 transition-colors duration-200 p-1.5 rounded-md hover:bg-white/10 flex items-center space-x-1"
              title="Clear filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l3.181-3.183a8.25 8.25 0 00-11.664 0l3.181 3.183z" />
              </svg>
              <span>Clear</span>
            </button>
      </div>

      <div
        id="filter-content"
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100 pt-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="space-y-4">
            <div>
                <label htmlFor="state-filter" className="block mb-2 text-sm font-medium text-gray-300 px-1">State</label>
                <div className="custom-select-wrapper">
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
            </div>
            <div>
                <label htmlFor="location-filter" className="block mb-2 text-sm font-medium text-gray-300 px-1">Location</label>
                <div className="custom-select-wrapper">
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
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
