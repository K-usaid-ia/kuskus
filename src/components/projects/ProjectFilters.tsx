"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProjectFiltersProps {
  onFilterChange?: (filters: ProjectFilters) => void;
}

interface ProjectFilters {
  status: string[];
  budgetRange: [number, number];
  location: string;
  showVerifiedOnly: boolean;
}

export default function ProjectFilters({
  onFilterChange,
}: ProjectFiltersProps) {
  const [filters, setFilters] = useState<ProjectFilters>({
    status: [],
    budgetRange: [0, 100000],
    location: "",
    showVerifiedOnly: false,
  });

  const handleFilterChange = (newFilters: Partial<ProjectFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-900">Project Status</h3>
          <Select
            onValueChange={(value) => handleFilterChange({ status: [value] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending_verification">
                Pending Verification
              </SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-900">Budget Range</h3>
          <Slider
            defaultValue={[0, 100000]}
            max={100000}
            step={1000}
            onValueChange={(value) =>
              handleFilterChange({ budgetRange: value as [number, number] })
            }
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${filters.budgetRange[0]}</span>
            <span>${filters.budgetRange[1]}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-900">Location</h3>
          <Select
            onValueChange={(value) => handleFilterChange({ location: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ghana">Ghana</SelectItem>
              <SelectItem value="kenya">Kenya</SelectItem>
              <SelectItem value="nigeria">Nigeria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="verified-switch">Verified Projects Only</Label>
          <Switch
            id="verified-switch"
            checked={filters.showVerifiedOnly}
            onCheckedChange={(checked) =>
              handleFilterChange({ showVerifiedOnly: checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
