import { Trophy, Users, CheckCircle, X, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ShortlistedCandidatesSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section Skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-primary" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Shortlisted Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hired Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-8 w-6" />
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rejected Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-6" />
                </div>
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Score Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                    <Skeleton className="h-6 w-32 mb-1" />
                    {/* Email Skeleton */}
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Job Applied Section */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  {/* AI Score Section */}
                  <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </div>
                  </div>

                  {/* Experience and Skills Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: 4 }).map((_, skillIndex) => (
                        <Skeleton
                          key={skillIndex}
                          className="h-5 w-16 rounded-full"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Dates Section */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="flex gap-2 pt-4 mt-auto">
                  <Skeleton className="h-8 flex-1 rounded-md" />
                  <Skeleton className="h-8 flex-1 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
