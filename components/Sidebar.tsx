import React, { useState } from 'react';
import InfoPanel from './InfoPanel';
import ChartPanel from './ChartPanel';
import { Feature, FeatureCollection } from '../types';

interface SidebarProps {
  selectedFeature: Feature | null;
  allData: FeatureCollection;
  filteredData: FeatureCollection;
}

type Tab = 'details' | 'charts';

const Sidebar: React.FC<SidebarProps> = ({ selectedFeature, allData, filteredData }) => {
  const [activeTab, setActiveTab] = useState<Tab>('details');

  const tabStyle = "flex-1 py-2.5 px-4 text-center text-sm font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500";
  const activeTabStyle = "bg-cyan-600 text-white tab-glow";
  const inactiveTabStyle = "text-gray-300 bg-gray-500/10 hover:bg-gray-500/20";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 bg-black/20 p-1 rounded-xl mb-4">
        <button 
          onClick={() => setActiveTab('details')}
          className={`${tabStyle} ${activeTab === 'details' ? activeTabStyle : inactiveTabStyle}`}
        >
          Details
        </button>
        <button 
          onClick={() => setActiveTab('charts')}
          className={`${tabStyle} ${activeTab === 'charts' ? activeTabStyle : inactiveTabStyle}`}
        >
          Charts
        </button>
      </div>
      <div className="flex-1">
        {activeTab === 'details' && (
          <InfoPanel feature={selectedFeature} allData={allData} />
        )}
        {activeTab === 'charts' && (
          <ChartPanel filteredData={filteredData} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;