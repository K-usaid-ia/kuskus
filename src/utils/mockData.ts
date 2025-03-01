import {
  Project,
  User,
  Vendor,
  Donation,
  PurchaseOrder,
  VendorCategory,
} from "@/types/schema";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "donor@example.com",
    name: "John Donor",
    user_type: "donor",
    verified: true,
    wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "org@example.com",
    name: "Education Foundation",
    user_type: "organization",
    verified: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "vendor@example.com",
    name: "Kumasi Builders",
    user_type: "vendor",
    verified: true,
    wallet_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    created_at: "2025-01-01T00:00:00Z",
  },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "School Construction in Kumasi",
    description:
      "Building a new primary school with six classrooms to serve the local community",
    organization_id: "2",
    location: {
      country: "Ghana",
      city: "Kumasi",
      coordinates: {
        latitude: 6.6885,
        longitude: -1.6244,
      },
    },
    budget: 50000,
    timeline_start: "2025-03-01",
    timeline_end: "2025-08-31",
    status: "active",
    contract_address: "0x9876543210fedcba9876543210fedcba98765432",
    milestones: [
      {
        id: "1",
        project_id: "1",
        title: "Foundation",
        description: "Laying the foundation for all six classrooms",
        amount: 15000,
        due_date: "2025-04-01",
        vendor_id: "1",
        status: "completed",
        created_at: "2025-03-01T00:00:00Z",
      },
      {
        id: "2",
        project_id: "1",
        title: "Walls and Roofing",
        description: "Construction of walls and installation of roof",
        amount: 20000,
        due_date: "2025-06-01",
        vendor_id: "1",
        status: "in_progress",
        created_at: "2025-03-01T00:00:00Z",
      },
    ],
    created_at: "2025-03-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Medical Supplies for Rural Clinic",
    description: "Providing essential medical supplies to a rural clinic",
    organization_id: "2",
    location: {
      country: "Ghana",
      city: "Tamale",
      coordinates: {
        latitude: 9.4042,
        longitude: -0.8393,
      },
    },
    budget: 25000,
    timeline_start: "2025-04-01",
    timeline_end: "2025-05-31",
    status: "pending_verification",
    milestones: [],
    created_at: "2025-03-15T00:00:00Z",
  },
];

export const mockVendors: Vendor[] = [
  {
    id: "1",
    user_id: "3",
    business_name: "Kumasi Builders Ltd",
    business_registration: "KBI123456",
    service_category: ["construction", "supplies"],
    rating: 4.8,
    total_orders: 15,
    verification_documents: [
      {
        type: "business_license",
        url: "https://example.com/docs/license.pdf",
        verified: true,
      },
    ],
  },
];

export const mockDonations: Donation[] = [
  {
    id: "1",
    project_id: "1",
    donor_id: "1",
    amount: 5000,
    transaction_hash:
      "0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456",
    status: "confirmed",
    created_at: "2025-03-05T00:00:00Z",
  },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    project_id: "1",
    vendor_id: "1",
    milestone_id: "1",
    amount: 15000,
    status: "paid",
    transaction_hash:
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
    delivery_confirmation: {
      confirmed_by: "2",
      confirmation_date: "2025-03-31T00:00:00Z",
      notes:
        "All materials delivered and work completed according to specifications",
      evidence_urls: [
        "https://example.com/photos/foundation1.jpg",
        "https://example.com/photos/foundation2.jpg",
      ],
    },
  },
];
