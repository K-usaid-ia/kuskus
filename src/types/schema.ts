export interface User {
  id: string;
  email: string;
  user_type: "donor" | "organization" | "vendor" | "admin";
  verified: boolean;
  wallet_address?: string;
  phone_number?: string;
  created_at: string;
  name: string;
}

export type UserRole = 'donor' | 'organization' | 'vendor' | 'admin';


export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  organization: {
    id: number;
    username: string;
  };
  
  // Location and Beneficiaries
  location: string;
  gps_coordinates?: string;
  beneficiary_community: string;
  beneficiary_count: number;
  
  // Financial Information
  budget: number;
  vetting_fee: number;
  insurance_fee: number;
  total_funding_goal: number;
  current_funds: number;
  funding_percentage: number;
  
  // Timeline
  timeline_start: string; // Date in ISO format
  timeline_end: string; // Date in ISO format
  
  // Status and Verification
  status: 'draft' | 'pending_review' | 'approved' | 'active' | 'completed' | 'cancelled';
  is_verified: boolean;
  verification_notes?: string;
  
  // Contact Information
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  
  // Social Media and External Verification
  website_url?: string;
  social_media_links: Record<string, string>;
  external_references: string[];
  
  // Success Metrics
  success_metrics: string[];
  impact_assessment_method: string;
  
  // Blockchain Information
  wallet_address: string;
  contract_address?: string;
  blockchain_tx_hash?: string;
  
  // Media
  featured_image?: string; // URL to the image
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Related data
  milestones?: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: number;
  project: number; // Project ID
  title: string;
  description: string;
  amount: number;
  due_date: string; // Date in ISO format
  
  // Vendor information
  vendor?: {
    id: number;
    business_name: string;
  };
  
  // Status tracking
  completed: boolean;
  completion_date?: string; // Date in ISO format
  funds_released: boolean;
  
  // Blockchain information
  purchase_order_id?: number;
  blockchain_tx_hash?: string;
  
  // Evidence and verification
  verification_documents: any[]; // List of document references
  photo_evidence?: string; // URL to the image
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ProjectsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}


export interface Vendor {
  id: number;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  description: string;
  website?: string;
  social_media?: Record<string, string>;
  verified: boolean;
  rating: number;
  completed_projects: number;
  wallet_address: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  specialties?: string[];
  service_category: VendorCategory[];
  verification_documents: VerificationDocument[];
}

export type VendorCategory =
  | "construction"
  | "supplies"
  | "logistics"
  | "medical"
  | "education"
  | "other";

export interface VerificationDocument {
  type: "business_license" | "tax_certificate" | "identity_proof" | "other";
  url: string;
  verified: boolean;
}

export interface Donation {
  id: string;
  project_id: string;
  donor_id: string;
  amount: number;
  transaction_hash?: string;
  status: "pending" | "confirmed" | "failed";
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  project_id: string;
  vendor_id: string;
  milestone_id: string;
  amount: number;
  status:
    | "created"
    | "accepted"
    | "in_progress"
    | "delivered"
    | "verified"
    | "paid"
    | "disputed";
  transaction_hash?: string;
  delivery_confirmation?: DeliveryConfirmation;
}

export interface DeliveryConfirmation {
  confirmed_by: string;
  confirmation_date: string;
  notes?: string;
  evidence_urls: string[];
}
