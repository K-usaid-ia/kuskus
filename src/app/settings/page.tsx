import { Suspense } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ProfileSettings from "@/components/settings/ProfileSettings";
import WalletSettings from "@/components/settings/WalletSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <Suspense fallback={<LoadingSpinner />}>
          <ProfileSettings />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <WalletSettings />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <NotificationSettings />
        </Suspense>
      </div>
    </div>
  );
}
