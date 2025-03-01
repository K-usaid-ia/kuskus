import React from 'react';

interface GasFeeInfoProps {
  isCompact?: boolean;
}

const GasFeeInfo: React.FC<GasFeeInfoProps> = ({ isCompact = false }) => {
  if (isCompact) {
    return (
      <div className="text-xs text-gray-500 mt-2">
        <p>*A small blockchain gas fee will be required to process this transaction.</p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 p-4 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">About Blockchain Gas Fees</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              When confirming your donation, you'll need to pay a small gas fee to process the transaction on the blockchain. This fee:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Goes directly to blockchain network validators, not to KUSAIDIA</li>
              <li>Is required to securely record your transaction on the blockchain</li>
              <li>Enables the transparent, tamper-proof tracking of all donations</li>
              <li>Typically ranges from $0.10 to $2.00 depending on network conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasFeeInfo;