import React, { useMemo } from 'react';
import { Feature, FeatureCollection } from '../types';

interface InfoPanelProps {
  feature: Feature | null;
  allData: FeatureCollection;
}

// FIX: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const SummaryCard: React.FC<{title: string; value: string | number; icon: React.ReactNode}> = ({ title, value, icon }) => (
    <div className="bg-gray-900/50 p-4 rounded-xl shadow-lg border border-gray-700 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-100">{value}</p>
        </div>
        <div className="bg-blue-900/50 text-blue-400 p-3 rounded-full">
            {icon}
        </div>
    </div>
);

const InfoPanel: React.FC<InfoPanelProps> = ({ feature, allData }) => {
  const summary = useMemo(() => {
    const totalPoints = allData.features.length;
    const states = new Set<string>();
    const locations = new Set<string>();

    allData.features.forEach(f => {
      if (f.properties.State) states.add(f.properties.State.trim());
      if (f.properties.Location) locations.add(f.properties.Location.trim());
    });

    return {
      totalPoints,
      uniqueStates: states.size,
      uniqueLocations: locations.size
    };
  }, [allData]);

  const renderProperties = (properties: Feature['properties']) => {
    return Object.entries(properties)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => (
        <div key={key} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-gray-700">
          <dt className="text-sm font-medium text-gray-400 capitalize">{key.replace(/_/g, ' ')}</dt>
          <dd className="mt-1 text-sm text-gray-100 font-semibold sm:mt-0 sm:col-span-2 break-words">{String(value)}</dd>
        </div>
      ));
  };
  
  const vesId = feature?.properties?.VESID || feature?.properties?.['VES ID'];

  return (
    <div className="h-full">
      {feature ? (
        <div className="animate-fade-in">
          <div className="bg-blue-600/80 text-white p-4 rounded-lg mb-4 shadow-lg">
            <h3 className="text-lg font-bold">Point Details</h3>
            <p className="text-blue-200 text-md truncate">{vesId}</p>
          </div>
          <dl>
            {renderProperties(feature.properties)}
          </dl>
        </div>
      ) : (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-gray-100 border-b border-gray-600 pb-2 mb-4">Dashboard Summary</h3>
          <div className="space-y-4">
            <SummaryCard title="Total Survey Points" value={summary.totalPoints} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
            <SummaryCard title="Unique States" value={summary.uniqueStates} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.884 5.036A9 9 0 0112 3c3.859 0 7.215 2.502 8.116 6.036m-14.456 0a48.108 48.108 0 00-2.478 5.405A48.11 48.11 0 0012 21c3.223 0 6.22-1.04 8.64-2.846" /></svg>} />
            <SummaryCard title="Unique Locations" value={summary.uniqueLocations} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />

            <p className="text-center text-gray-500 pt-8">Select a point on the map to see details or use the filters to explore the data.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;