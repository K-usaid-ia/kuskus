// src/app/projects/[id]/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projectsApi } from '@/utils/api';
import { useAuth } from '@/features/auth/AuthContext';
import AppLayout from "@/components/layout/AppLayout";
import GasFeeInfo from '@/components/common/GasFeeInfo';
import DonationSuccess from '../../donations/DonationSuccess';
import { useClientSideFormatting } from '@/app/hooks/useClientSideFormatting';
import RoleActionButton from '@/components/RoleActionButton'; 

interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: number;
  due_date: string;
  completed: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  location: string;
  status: string;
  timeline_start: string;
  timeline_end: string;
  contract_address: string | null;
  organization: {
    id: number;
    username: string;
  };
  milestones: Milestone[];
}

export default function ProjectDetailPage() {

  const { formatCurrency, formatDate, isMounted } = useClientSideFormatting();

  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, connectWallet } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState<number>(10);
  const [donating, setDonating] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [showGasFeeInfo, setShowGasFeeInfo] = useState(false);
  const [donationStatus, setDonationStatus] = useState<{
    success: boolean;
    amount: number;
    transactionHash?: string;
  } | null>(null);
  const [coverServiceFee, setCoverServiceFee] = useState<boolean>(true);

  const SERVICE_FEE_PERCENTAGE = 0.02; // 2%

  // Add these helper functions
  const calculateServiceFee = (amount: number): number => {
    return parseFloat((amount * SERVICE_FEE_PERCENTAGE).toFixed(2));
  };

  const calculateTotalAmount = (): number => {
    const serviceFee = calculateServiceFee(donationAmount);
    return coverServiceFee ? donationAmount + serviceFee : donationAmount;
  };

  const calculateProjectAmount = (): number => {
    const serviceFee = calculateServiceFee(donationAmount);
    return coverServiceFee ? donationAmount : donationAmount - serviceFee;
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsApi.getById(id as string);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

const handleDonate = async () => {
  if (!isAuthenticated) {
    connectWallet();
    return;
  }

  if (!project || donationAmount <= 0) return;

  setDonating(true);
  try {
    // Pass the additional fee information to the API
    const response = await projectsApi.donate(
      project.id.toString(), 
      donationAmount,
      {
        service_fee: calculateServiceFee(donationAmount),
        total_amount: calculateTotalAmount(),
        project_amount: calculateProjectAmount(),
        donor_covered_fee: coverServiceFee
      }
    );
    
    setDonationSuccess(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setDonationSuccess(false);
      setDonationAmount(10);
      setCoverServiceFee(true);
    }, 3000);
  } catch (error) {
    console.error('Donation failed:', error);
    alert('Donation failed. Please try again.');
  } finally {
    setDonating(false);
  }
};

// Replace the Donation Success Message section with:
{donationStatus && donationStatus.success && (
  <DonationSuccess 
    amount={donationStatus.amount}
    projectTitle={project?.title || ''}
    transactionHash={donationStatus.transactionHash}
  />
)}

{donationStatus && !donationStatus.success && (
  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
    <p className="text-red-700 font-medium">
      There was an issue processing your donation. Please try again or contact support.
    </p>
  </div>
)}

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center p-8">
          <h2 className="text-xl font-medium text-gray-900">Project not found</h2>
          <p className="mt-2 text-gray-500">The project you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/projects')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View All Projects
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Project Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{project.location}</p>
        </div>

        {/* Project Content */}
        <div className="p-6">
          {/* Project Description */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">About this project</h2>
            <p className="text-gray-700">{project.description}</p>
          </div>

          {/* Donation Success Message */}
          {donationSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">Thank you for your donation! Your contribution will help make a difference.</p>
            </div>
          )}

          {/* Project Info and Donation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Info */}
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Project Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{project.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{formatDate(project.timeline_start)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{formatDate(project.timeline_end)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Organization</p>
                  <p className="font-medium">{project.organization.username}</p>
                </div>
                {project.contract_address && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Smart Contract</p>
                    <p className="font-medium text-xs font-mono truncate">{project.contract_address}</p>
                  </div>
                )}
              </div>
            </div>

           {/* Donation Form */}
<div className="bg-indigo-50 p-4 rounded-lg">
  <h2 className="text-lg font-medium text-indigo-900 mb-2">Make a Donation</h2>
  <p className="text-sm text-indigo-700 mb-4">
    Your donation will be processed securely using blockchain technology.
  </p>
  
  <div className="mb-4">
    <label htmlFor="amount" className="block text-sm font-medium text-indigo-700 mb-1">
      Donation Amount (USD)
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">$</span>
      </div>
      <input
        type="number"
        name="amount"
        id="amount"
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
        placeholder="0.00"
        value={donationAmount}
        onChange={(e) => setDonationAmount(Number(e.target.value))}
        min="1"
      />
    </div>
  </div>
  
  {/* Service Fee Option */}
  <div className="mb-4">
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id="coverFee"
          name="coverFee"
          type="checkbox"
          checked={coverServiceFee}
          onChange={(e) => setCoverServiceFee(e.target.checked)}
          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor="coverFee" className="font-medium text-indigo-700">
          I'd like to cover the 2% platform maintenance fee
        </label>
        <p className="text-indigo-500">This ensures 100% of your donation goes to the project</p>
      </div>
    </div>
  </div>
  
  {/* Fee Breakdown */}
  <div className="mb-4 p-3 bg-white rounded-md text-sm">
    <div className="flex justify-between">
      <span className="text-gray-600">Donation to project:</span>
      <span className="font-medium">${coverServiceFee ? donationAmount.toFixed(2) : calculateProjectAmount().toFixed(2)}</span>
    </div>
    <div className="flex justify-between mt-1">
      <span className="text-gray-600">Platform fee (2%):</span>
      <span className="font-medium">${calculateServiceFee(donationAmount).toFixed(2)}</span>
    </div>
    <div className="border-t border-gray-100 my-2"></div>
    <div className="flex justify-between font-medium">
      <span>Total amount:</span>
      <span>${calculateTotalAmount().toFixed(2)}</span>
    </div>
  </div>
  
  {/* Gas Fee Note */}
  <div className="mb-4 text-xs text-gray-500">
    <p>Note: A small blockchain gas fee (typically $0.10-$0.25) will be required to process this transaction on the Celo network.</p>
  </div>

  <RoleActionButton
  requiredRole="donor"
  actionDescription="donate to this project"
  onClick={handleDonate}
  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
>
  {donating 
    ? 'Processing...' 
    : `Donate $${calculateTotalAmount().toFixed(2)}`}
</RoleActionButton>

{/*   
  <button
    type="button"
    onClick={handleDonate}
    disabled={donating}
    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
  >
    {!isAuthenticated 
      ? 'Connect Wallet to Donate' 
      : donating 
        ? 'Processing...' 
        : `Donate $${calculateTotalAmount().toFixed(2)}`}
  </button> */}
  
  <div className="mt-2">
    <GasFeeInfo isCompact={true} />
  </div>
</div>
          </div>

          {/* Project Milestones */}
          {project.milestones && project.milestones.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Project Milestones</h2>
              
              <div className="border border-gray-200 rounded-md overflow-hidden">
                {project.milestones.map((milestone, index) => (
                  <div 
                    key={milestone.id} 
                    className={`p-4 ${
                      index < project.milestones.length - 1 ? 'border-b border-gray-200' : ''
                    } ${milestone.completed ? 'bg-green-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Due: {formatDate(milestone.due_date)}
                        </p>
                        <p className="mt-2 text-sm text-gray-700">{milestone.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-medium">{formatCurrency(milestone.amount)}</span>
                        <span className={`mt-1 text-xs px-2 py-1 rounded-full ${
                          milestone.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {milestone.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transparency Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-medium text-blue-900 mb-2">Transparency Guarantee</h2>
            <p className="text-sm text-blue-700">
              All donations to this project are securely recorded on the blockchain, ensuring complete
              transparency. Funds are directly allocated to verified vendors through smart contracts,
              eliminating intermediaries and ensuring your donation reaches those in need.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}