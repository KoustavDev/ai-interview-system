import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Briefcase, MapPin, DollarSign, Calendar, Clock, Building2, Send } from "lucide-react"

export function CandidateDashboardSkeleton({
  showStats = true,
  cardCount = 6,
  isInfiniteLoading = false,
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section - Only show if not infinite loading */}
        {!isInfiniteLoading && (
          <div className="mb-8">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
        )}

        {/* Stats Overview - Only show if not infinite loading */}
        {showStats && !isInfiniteLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Available Jobs Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications Sent Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Send className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New This Week Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-6" />
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: cardCount }).map((_, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Skeleton className="h-6 w-48 flex-1" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Job Description */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  {/* Skills Required */}
                  <div>
                    <Skeleton className="h-3 w-24 mb-2" />
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: 4 }).map((_, skillIndex) => (
                        <Skeleton key={skillIndex} className="h-6 w-16 rounded-full" />
                      ))}
                      <Skeleton className="h-6 w-8 rounded-full" />
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3 w-3 text-muted-foreground" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 mt-auto">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Infinite Loading Indicator - Only show during infinite loading */}
        {isInfiniteLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading more jobs...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

