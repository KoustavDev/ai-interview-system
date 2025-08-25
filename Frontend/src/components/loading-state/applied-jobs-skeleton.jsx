import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, Briefcase, Mail, Phone } from "lucide-react";


export function AppliedJobsSkeleton({
  jobCount = 6,
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Buttons Skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20" />
          ))}
        </div>

        {/* Job Applications Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: jobCount }).map((_, index) => (
            <Card
              key={index}
              className={`hover:shadow-lg transition-all duration-200 flex flex-col h-full ${
                index % 3 === 0 ? "ring-2 ring-green-200 bg-green-50/30" : ""
              }`}
            >
              <CardContent className="p-6 flex-1 flex flex-col">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-6 w-full mb-2" />
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <Skeleton
                      className={`h-6 w-20 rounded-full ${
                        index % 4 === 0
                          ? "bg-green-100"
                          : index % 4 === 1
                          ? "bg-blue-100"
                          : index % 4 === 2
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    />
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <Skeleton className="h-3 w-24" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs">📍</span>
                    <Skeleton className="h-3 w-28" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <Skeleton className="h-3 w-20" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs">💰</span>
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>

                {/* HR Contact Info for Shortlisted (every 3rd card) */}
                {index % 3 === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <Skeleton className="h-3 w-20 mb-2" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-green-600" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-green-600" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                  <Skeleton className="h-8 w-full" />
                  {index % 3 === 0 && (
                    <Skeleton className="h-8 w-full bg-green-100" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shortlisted Highlight Skeleton */}
        <Card className="mt-8 border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-5 w-80 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


