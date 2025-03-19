import React from 'react'


const MetricCard = ({ icon, title, value, change, isPositive }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${icon.bgColor}`}>
          {icon.element}
        </div>
        <span className="text-gray-500">{title}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-4xl font-bold">{value}</span>
        <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
};


function MainAdmin() {


  const metrics = [
    {
      icon: {
        element: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>,
        bgColor: 'bg-blue-500',
      },
      title: 'Total Revenue',
      value: '$42,580',
      change: 3.2,
      isPositive: true,
    },
    {
      icon: {
        element: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>,
        bgColor: 'bg-purple-500',
      },
      title: 'New Customers',
      value: '1,245',
      change: 2.8,
      isPositive: true,
    },
    {
      icon: {
        element: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>,
        bgColor: 'bg-pink-500',
      },
      title: 'Total Orders',
      value: '865',
      change: -1.5,
      isPositive: false,
    },
    {
      icon: {
        element: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>,
        bgColor: 'bg-orange-500',
      },
      title: 'Conversion Rate',
      value: '12.8%',
      change: 0.5,
      isPositive: true,
    },
  ];

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            icon={metric.icon}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
          />
        ))}
      </div>
    </div>

  )
}

export default MainAdmin