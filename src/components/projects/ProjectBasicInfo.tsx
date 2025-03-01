"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ProjectFormData {
  title: string;
  description: string;
  location: {
    country: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  budget: number;
  timeline_start: string;
  timeline_end: string;
}

interface ProjectBasicInfoProps {
  onNext: (data: ProjectFormData) => void;
}

export default function ProjectBasicInfo({ onNext }: ProjectBasicInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProjectFormData>({
    defaultValues: {
      location: {
        country: "",
        city: "",
      },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeline_start = watch("timeline_start");

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      // You could add validation or data transformation here
      await onNext(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Project Title
          </label>
          <div className="mt-1">
            <input
              id="title"
              type="text"
              {...register("title", {
                required: "Project title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
              })}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              rows={4}
              {...register("description", {
                required: "Project description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
              })}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <div className="mt-1">
              <input
                id="country"
                type="text"
                {...register("location.country", {
                  required: "Country is required",
                })}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.location?.country && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.country.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <div className="mt-1">
              <input
                id="city"
                type="text"
                {...register("location.city", {
                  required: "City is required",
                })}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.location?.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.city.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700"
          >
            Budget (USD)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              id="budget"
              type="number"
              {...register("budget", {
                required: "Budget is required",
                min: {
                  value: 100,
                  message: "Budget must be at least $100",
                },
              })}
              className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="0.00"
            />
            {errors.budget && (
              <p className="mt-1 text-sm text-red-600">
                {errors.budget.message}
              </p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="timeline_start"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <div className="mt-1">
              <input
                id="timeline_start"
                type="date"
                {...register("timeline_start", {
                  required: "Start date is required",
                })}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.timeline_start && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.timeline_start.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="timeline_end"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <div className="mt-1">
              <input
                id="timeline_end"
                type="date"
                {...register("timeline_end", {
                  required: "End date is required",
                  validate: (value) =>
                    !timeline_start ||
                    new Date(value) > new Date(timeline_start) ||
                    "End date must be after start date",
                })}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.timeline_end && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.timeline_end.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isSubmitting ? "Saving..." : "Next Step"}
          </button>
        </div>
      </form>
    </div>
  );
}
