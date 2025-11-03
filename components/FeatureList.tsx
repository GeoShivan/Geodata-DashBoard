import React, { useEffect, useRef } from 'react';
import { Feature } from '../types';
import { getFeatureId } from '../utils';

interface FeatureListProps {
    features: Feature[];
    selectedFeature: Feature | null;
    onFeatureSelect: (feature: Feature) => void;
}

const FeatureList: React.FC<FeatureListProps> = ({ features, selectedFeature, onFeatureSelect }) => {
    const listContainerRef = useRef<HTMLUListElement>(null);
    const selectedItemRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (selectedItemRef.current && listContainerRef.current) {
            selectedItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [selectedFeature]);

    if (features.length === 0) {
        return <p className="text-center text-gray-500 pt-8">No features match the current filters.</p>;
    }

    return (
        <ul ref={listContainerRef} className="space-y-2 animate-fade-in">
            {features.map((feature) => {
                const id = getFeatureId(feature);
                const isSelected = selectedFeature ? getFeatureId(selectedFeature) === id : false;
                const vesId = feature.properties.VESID || feature.properties['VES ID'];
                const location = feature.properties.Location;

                return (
                    <li
                        key={id}
                        ref={isSelected ? selectedItemRef : null}
                        onClick={() => onFeatureSelect(feature)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                            isSelected 
                            ? 'bg-cyan-900/50 border-cyan-400 shadow-lg shadow-cyan-500/20' 
                            : 'bg-gray-800/50 border-transparent hover:bg-gray-700/70 hover:border-gray-600'
                        }`}
                        aria-current={isSelected}
                    >
                        <p className="font-bold text-gray-100 truncate">{vesId}</p>
                        <p className="text-sm text-gray-400 truncate">{location || 'Unknown Location'}</p>
                    </li>
                );
            })}
        </ul>
    );
};

export default FeatureList;
