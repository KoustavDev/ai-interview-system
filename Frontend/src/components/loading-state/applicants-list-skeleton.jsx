import { User, Calendar, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ApplicantsListSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section Skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Stats and Filters Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
            </div>
          </div>

          {/* Filter Buttons Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-22" />
          </div>
        </div>

        {/* Candidates Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-200 flex flex-col h-full"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  {/* Avatar Skeleton */}
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 min-w-0">
                    {/* Name Skeleton */}
                    <Skeleton className="h-5 w-32 mb-2" />
                    <div className="space-y-1">
                      {/* Email Skeleton */}
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      {/* Phone Skeleton */}
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Experience and Applied Date Skeleton */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  {/* Skills Section Skeleton */}
                  <div>
                    <Skeleton className="h-3 w-12 mb-2" />
                    <div className="flex flex-wrap gap-1">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-18 rounded-full" />
                      <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                  </div>

                  <Separator />

                  {/* Status and AI Score Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Status Icon - alternating between completed and pending */}
                      {index % 2 === 0 ? (
                        <div className="h-4 w-4 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                        </div>
                      ) : (
                        <div className="h-4 w-4 bg-orange-100 rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                        </div>
                      )}
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    {/* AI Score Skeleton */}
                    <div className="text-right">
                      <Skeleton className="h-3 w-12 mb-1" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-2 pt-4 mt-auto">
                  <div className="flex-1">
                    <Skeleton className="h-8 w-full rounded-md" />
                  </div>
                  <div className="flex-1">
                    <Skeleton className="h-8 w-full rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
