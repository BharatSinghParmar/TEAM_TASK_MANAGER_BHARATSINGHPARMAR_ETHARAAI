import React from 'react';

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-full mr-5 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const DashboardStats = ({ metrics }) => {
  const { projects, tasks } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <StatCard 
        title="Projects" 
        value={projects} 
        colorClass="bg-purple-100 text-purple-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />
      
      <StatCard 
        title="Total Tasks" 
        value={tasks.total} 
        colorClass="bg-blue-100 text-blue-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        }
      />
      
      <StatCard 
        title="In Progress" 
        value={tasks.inProgress} 
        colorClass="bg-yellow-100 text-yellow-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      
      <StatCard 
        title="Completed" 
        value={tasks.completed} 
        colorClass="bg-green-100 text-green-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        }
      />

      <StatCard 
        title="Overdue" 
        value={tasks.overdue || 0} 
        colorClass="bg-red-100 text-red-600"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
};

export default DashboardStats;
