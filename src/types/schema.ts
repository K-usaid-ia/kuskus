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

export interface Project {
  id: string;
  title: string;
  description: string;
  organization_id: string;
  location: Location;
  budget: number;
  timeline_start: string;
  timeline_end: string;
  status:
    | "draft"
    | "pending_verification"
    | "active"
    | "completed"
    | "cancelled";
  contract_address?: string;
  milestones: Milestone[];
  created_at: string;
}

export interface Location {
  country: string;
  city: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  amount: number;
  due_date: string;
  vendor_id?: string;
  status: "pending" | "in_progress" | "completed" | "verified";
  created_at: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  business_registration: string;
  service_category: VendorCategory[];
  rating: number;
  total_orders: number;
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
