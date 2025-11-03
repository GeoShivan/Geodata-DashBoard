import React from 'react';
import InfoPanel from './InfoPanel';
import ChartPanel from './ChartPanel';
import FeatureList from './FeatureList';
import { Feature, FeatureCollection } from '../types';
import { SidebarTab } from '../App';

interface SidebarProps {
  selectedFeature: Feature | null;
  allData: FeatureCollection;
  filteredData: FeatureCollection;
  onFeatureSelect: (feature: Feature) => void;
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedFeature, 
  allData, 
  filteredData, 
  onFeatureSelect, 
  activeTab, 
  setActiveTab 
}) => {

  const tabStyle = "flex-1 py-2.5 px-4 text-center text-sm font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500";
  const activeTabStyle = "bg-cyan-600 text-white tab-glow";
  const inactiveTabStyle = "text-gray-300 bg-gray-500/10 hover:bg-gray-500/20";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 bg-black/20 p-1 rounded-xl mb-4">
        <button 
          onClick={() => setActiveTab('details')}
          className={`${tabStyle} ${activeTab === 'details' ? activeTabStyle : inactiveTabStyle}`}
          aria-pressed={activeTab === 'details'}
        >
          Details
        </button>
        <button 
          onClick={() => setActiveTab('list')}
          className={`${tabStyle} ${activeTab === 'list' ? activeTabStyle : inactiveTabStyle}`}
          aria-pressed={activeTab === 'list'}
        >
          List ({filteredData.features.length})
        </button>
        <button 
          onClick={() => setActiveTab('charts')}
          className={`${tabStyle} ${activeTab === 'charts' ? activeTabStyle : inactiveTabStyle}`}
          aria-pressed={activeTab === 'charts'}
        >
          Charts
        </button>
      </div>
      <div className="flex-1">
        {activeTab === 'details' && (
          <InfoPanel feature={selectedFeature} allData={allData} />
        )}
        {activeTab === 'list' && (
          <FeatureList 
            features={filteredData.features} 
            selectedFeature={selectedFeature} 
            onFeatureSelect={onFeatureSelect} 
          />
        )}
        {activeTab === 'charts' && (
          <ChartPanel filteredData={filteredData} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
