// src/components/donations/DonationSuccess.tsx
import React from 'react';
import { useEffect } from 'react';
import { useClientSideFormatting } from '@/app/hooks/useClientSideFormatting';
import { useNotifications } from '@/features/notifications/NotificationContext';

interface DonationSuccessProps {
  amount: number;
  projectTitle: string;
  transactionHash?: string;
}

const DonationSuccess: React.FC<DonationSuccessProps> = ({ 
  amount, 
  projectTitle,
  transactionHash
}) => {
  const { formatCurrency } = useClientSideFormatting();
  const { loadNotifications } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">Donation Successful!</h3>
          <div className="mt-2 text-sm text-green-700">
            <p>Thank you for your generous donation of <strong>{formatCurrency(amount)}</strong> to <strong>{projectTitle}</strong>.</p>
            
            {transactionHash && !transactionHash.startsWith('pending_') && (
              <div className="mt-2">
                <p>Transaction ID:</p>
                <a 
                  href={`https://celoscan.io/tx/${transactionHash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-xs break-all text-green-600 hover:text-green-800"
                >
                  {transactionHash}
                </a>
              </div>
            )}
            
            <p className="mt-2">
              Your donation is being processed through our blockchain system to ensure transparency and direct impact. You'll receive a notification once the transaction is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;