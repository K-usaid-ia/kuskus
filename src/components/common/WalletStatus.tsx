// src/components/common/WalletStatus.tsx
import { useAuth } from "@/features/auth/AuthContext";

const WalletStatus = () => {
  const { wallet, isAuthenticated } = useAuth();

  // Format wallet address for display
  const formatWalletAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isAuthenticated || !wallet.address) {
    return <span className="text-red-600">Not Connected</span>;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
      <span className="text-green-600">
        {formatWalletAddress(wallet.address)}
      </span>
    </div>
  );
};

export default WalletStatus;
