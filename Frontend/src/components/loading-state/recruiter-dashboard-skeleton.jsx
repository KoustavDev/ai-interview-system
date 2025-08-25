import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function RecruiterDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-9 w-32 mb-2" /> {/* Dashboard title */}
            <Skeleton className="h-5 w-64" /> {/* Subtitle */}
          </div>
          <Skeleton className="h-10 w-32 self-start sm:self-auto" />{" "}
          {/* Post New Job button */}
        </div>

        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Jobs Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />{" "}
                  {/* "Active Jobs" text */}
                  <Skeleton className="h-8 w-8" /> {/* Number */}
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Skeleton className="h-6 w-6" /> {/* Icon */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Applications Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />{" "}
                  {/* "Total Applications" text */}
                  <Skeleton className="h-8 w-10" /> {/* Number */}
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Skeleton className="h-6 w-6" /> {/* Icon */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avg Applications Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />{" "}
                  {/* "Avg. Applications" text */}
                  <Skeleton className="h-8 w-8" /> {/* Number */}
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Skeleton className="h-6 w-6" /> {/* Icon */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" /> {/* "Your Job Postings" title */}
            <Skeleton className="h-4 w-24" /> {/* "X active jobs" text */}
          </div>

          {/* Job Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Generate 5 skeleton job cards */}
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Skeleton className="h-6 w-48 flex-1" /> {/* Job title */}
                    <Skeleton className="h-5 w-16 shrink-0" />{" "}
                    {/* Job type badge */}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3" /> {/* Location icon */}
                      <Skeleton className="h-3 w-32" /> {/* Location text */}
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3" /> {/* Salary icon */}
                      <Skeleton className="h-3 w-24" /> {/* Salary text */}
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3" /> {/* Date icon */}
                      <Skeleton className="h-3 w-28" /> {/* Posted date */}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {/* Skills Section */}
                    <div>
                      <Skeleton className="h-3 w-24 mb-2" />{" "}
                      {/* "Skills Required:" text */}
                      <div className="flex flex-wrap gap-1">
                        {/* Skills badges */}
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-14" />
                        <Skeleton className="h-5 w-18" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-border" />

                    {/* Applications Count */}
                    <div className="flex items-center justify-center py-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" /> {/* Users icon */}
                        <Skeleton className="h-4 w-20" />{" "}
                        {/* "Applications:" text */}
                        <Skeleton className="h-6 w-6" /> {/* Number */}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 mt-auto">
                    <Skeleton className="h-8 w-full" />{" "}
                    {/* View Applicants button */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
