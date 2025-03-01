export default function DonationStats() {
  const stats = [
    {
      name: "Total Donations",
      value: "$125,000",
      change: "+12.5%",
      changeType: "increase",
    },
    {
      name: "Active Projects Funded",
      value: "24",
      change: "+3",
      changeType: "increase",
    },
    {
      name: "Successful Transfers",
      value: "156",
      change: "+28",
      changeType: "increase",
    },
    {
      name: "Average Response Time",
      value: "2.4h",
      change: "-0.5h",
      changeType: "decrease",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {stat.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stat.value}
            </dd>
            <dd className="mt-2 flex items-center text-sm">
              <span
                className={`${
                  stat.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                } font-semibold`}
              >
                {stat.change}
              </span>
              <span className="ml-2 text-gray-500">from last month</span>
            </dd>
          </div>
        </div>
      ))}
    </div>
  );
}
