export default function DashboardStats() {
  const stats = [
    {
      label: "Total Donations",
      value: "$125,000",
      change: "+12.5%",
      trend: "up",
    },
    {
      label: "Active Projects",
      value: "24",
      change: "+3",
      trend: "up",
    },
    {
      label: "Verified Vendors",
      value: "156",
      change: "+28",
      trend: "up",
    },
    {
      label: "Success Rate",
      value: "98.5%",
      change: "+2.1%",
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          <p className="mt-2 flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900">
              {stat.value}
            </span>
            <span
              className={`ml-2 text-sm font-medium ${
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

// export default function DashboardStats() {
//     const stats = [
//       { name: 'Total Projects', value: '12', change: '+2', changeType: 'increase' },
//       { name: 'Active Donors', value: '45', change: '+5', changeType: 'increase' },
//       { name: 'Verified Vendors', value: '23', change: '+3', changeType: 'increase' },
//       { name: 'Total Donations', value: '$125,000', change: '+12%', changeType: 'increase' },
//     ];

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat) => (
//           <div
//             key={stat.name}
//             className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
//           >
//             <p className="text-sm font-medium text-gray-600">{stat.name}</p>
//             <p className="mt-2 flex items-baseline">
//               <span className="text-2xl font-semibold text-gray-900">
//                 {stat.value}
//               </span>
//               <span className={`ml-2 text-sm font-medium ${
//                 stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {stat.change}
//               </span>
//             </p>
//           </div>
//         ))}
//       </div>
//     );
//   }
