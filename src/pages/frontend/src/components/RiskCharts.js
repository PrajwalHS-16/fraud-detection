import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const RiskCharts = ({ riskDistribution, flaggedData }) => {
  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#118AB2', '#073B4C'];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <h6 style={{ textAlign: 'center' }}>Risk Distribution</h6>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: '48%' }}>
          <h6 style={{ textAlign: 'center' }}>Transaction Status</h6>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={flaggedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {flaggedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#FF6B6B' : '#4ECDC4'} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default RiskCharts;