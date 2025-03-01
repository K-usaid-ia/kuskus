import { Donation } from "@/types/schema";

export default function RecentDonations({
  donations,
}: {
  donations: Donation[];
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Donations</h2>
        <div className="mt-6 space-y-4">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
            >
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-medium">
                    {donation.donor_id.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    ${donation.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(donation.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  donation.status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {donation.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
