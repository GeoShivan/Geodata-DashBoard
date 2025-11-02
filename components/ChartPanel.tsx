import React, { useMemo } from 'react';
import { FeatureCollection } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ChartPanelProps {
  filteredData: FeatureCollection;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#84cc16', '#f59e0b'];

const ChartPanel: React.FC<ChartPanelProps> = ({ filteredData }) => {
  const { stateData, locationData } = useMemo(() => {
    const stateCounts: { [key: string]: number } = {};
    const locationCounts: { [key: string]: number } = {};

    for (const feature of filteredData.features) {
      const state = feature.properties.State?.trim() || 'Unknown';
      const location = feature.properties.Location?.trim() || 'Unknown';

      stateCounts[state] = (stateCounts[state] || 0) + 1;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    }

    const stateChartData = Object.entries(stateCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const locationChartData = Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { stateData: stateChartData, locationData: locationChartData };
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
          <p className="label text-gray-200">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h4 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-600 pb-2">Points per State</h4>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={stateData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name"
                width={80}
                tick={{ fill: '#d1d5db', fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(107, 114, 128, 0.2)'}} />
              <Bar dataKey="count" fill="#22d3ee" radius={[0, 4, 4, 0]} barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-600 pb-2">Location Distribution</h4>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={locationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                tick={{ fill: '#d1d5db' }}
              >
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
               <Legend wrapperStyle={{fontSize: "12px", color: "#d1d5db"}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;
