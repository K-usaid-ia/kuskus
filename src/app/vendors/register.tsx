"use client";
import { useState } from "react";
import VendorRegistrationForm from "@/components/vendors/VendorRegistrationForm";
import VendorVerification from "@/components/vendors/VendorVerification";

export default function VendorRegistrationPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Vendor Registration
      </h1>

      {step === 1 && <VendorRegistrationForm onComplete={() => setStep(2)} />}
      {step === 2 && <VendorVerification />}
    </div>
  );
}
