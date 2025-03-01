// src/hooks/useClientSideFormatting.ts
import { useState, useEffect } from 'react';

export function useClientSideFormatting() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Safe number formatting
  const formatCurrency = (value: number) => {
    if (!isMounted) {
      // During SSR and initial hydration, use a consistent format
      return `$${value}`;
    }
    // After hydration, use locale-specific formatting
    return `$${value.toLocaleString()}`;
  };
  
  // Safe date formatting
  const formatDate = (dateString: string) => {
    if (!isMounted) {
      // During SSR and initial hydration, use a consistent format (ISO)
      return new Date(dateString).toISOString().split('T')[0];
    }
    // After hydration, use locale-specific formatting
    return new Date(dateString).toLocaleDateString();
  };
  
  return {
    isMounted,
    formatCurrency,
    formatDate
  };
}