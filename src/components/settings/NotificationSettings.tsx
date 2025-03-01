"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationPreferences {
  email: {
    projectUpdates: boolean;
    milestoneCompletion: boolean;
    donations: boolean;
    vendorUpdates: boolean;
  };
  frequency: "instant" | "daily" | "weekly";
  pushNotifications: boolean;
}

interface NotificationSettingsProps {
  initialPreferences?: NotificationPreferences;
  onSave?: (preferences: NotificationPreferences) => Promise<void>;
}

const defaultPreferences: NotificationPreferences = {
  email: {
    projectUpdates: true,
    milestoneCompletion: true,
    donations: true,
    vendorUpdates: false,
  },
  frequency: "instant",
  pushNotifications: true,
};

export default function NotificationSettings({
  initialPreferences = defaultPreferences,
  onSave,
}: NotificationSettingsProps) {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(initialPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSave?.(preferences);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update notification settings",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmailPreference = (
    key: keyof typeof preferences.email,
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: value,
      },
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
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
                Notification settings updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Email Notifications</h3>
            {Object.entries(preferences.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={`email-${key}`} className="flex-grow">
                  {key.split(/(?=[A-Z])/).join(" ")}
                </Label>
                <Switch
                  id={`email-${key}`}
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateEmailPreference(
                      key as keyof typeof preferences.email,
                      checked,
                    )
                  }
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notification Frequency</h3>
            <Select
              value={preferences.frequency}
              onValueChange={(value: "instant" | "daily" | "weekly") =>
                setPreferences((prev) => ({ ...prev, frequency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Push Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">
                Enable push notifications
              </Label>
              <Switch
                id="push-notifications"
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    pushNotifications: checked,
                  }))
                }
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
