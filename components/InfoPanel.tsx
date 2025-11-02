import React, { useMemo } from 'react';
import { Feature, FeatureCollection } from '../types';

interface InfoPanelProps {
  feature: Feature | null;
  allData: FeatureCollection;
}

const SummaryCard: React.FC<{title: string; value: string | number; icon: React.ReactNode}> = ({ title, value, icon }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg border border-white/10 flex items-center justify-between transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1">
        <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-100 text-glow">{value}</p>
        </div>
        <div className="bg-cyan-900/50 text-cyan-400 p-3 rounded-full">
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
        <div key={key} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-white/10 last:border-b-0">
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
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-lg mb-4 shadow-lg">
            <h3 className="text-lg font-bold">Point Details</h3>
            <p className="text-gray-200 text-md truncate">{vesId}</p>
          </div>
          <dl className="bg-gray-900/50 rounded-lg border border-white/10 px-4">
            {renderProperties(feature.properties)}
          </dl>
        </div>
      ) : (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-gray-100 border-b border-white/10 pb-2 mb-4">Dashboard Summary</h3>
          <div className="space-y-4">
            {/* FIX: Replaced non-standard `i-feather-*` icon tags with standard inline SVG elements to resolve JSX compilation errors. */}
            <SummaryCard title="Total Survey Points" value={summary.totalPoints} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>} />
            <SummaryCard title="Unique States" value={summary.uniqueStates} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>} />
            <SummaryCard title="Unique Locations" value={summary.uniqueLocations} icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>} />

            <p className="text-center text-gray-500 pt-8">Select a point on the map to see details or use the filters to explore the data.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;