"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/types/schema";
import { mockUsers } from "@/utils/mockData";

interface WalletSettingsProps {
  user?: User;
  onUpdate?: (walletAddress: string) => Promise<void>;
}

export default function WalletSettings({
  user = mockUsers[0],
  onUpdate,
}: WalletSettingsProps) {
  const [walletAddress, setWalletAddress] = useState(user.wallet_address || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEthereumAddress(walletAddress)) {
      setError("Invalid Ethereum address format");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onUpdate?.(walletAddress);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update wallet address",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>
                Wallet address updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="wallet-address">Ethereum Wallet Address</Label>
            <Input
              id="wallet-address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="font-mono"
              required
            />
            <p className="text-sm text-gray-500">
              Enter your Ethereum wallet address to receive payments and manage
              transactions
            </p>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Wallet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
