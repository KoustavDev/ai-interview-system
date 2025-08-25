import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  User,
  Briefcase,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JobDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Job Header Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Skeleton className="h-10 w-80" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Skeleton className="h-5 w-36" />
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-4">
                <div className="text-center lg:text-right space-y-1">
                  <div className="flex items-center justify-center lg:justify-end gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center justify-center lg:justify-end gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>

                {/* Start Interview Button */}
                <Skeleton className="w-full lg:w-auto min-w-[200px] h-14" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Job Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Briefcase className="h-5 w-5" />
              Job Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Required */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5" />
              Skills Required
            </CardTitle>
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Key Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-green-100 rounded-full mt-0.5 flex-shrink-0" />
                  <Skeleton className="h-4 flex-1 w-fit" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                  <Skeleton className="h-4 flex-1 w-fit" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Benefits & Perks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-yellow-100 rounded-full mt-0.5 flex-shrink-0" />
                  <Skeleton className="h-4 flex-1 w-fit" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Bottom CTA Section */}
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-5 w-96 mx-auto" />
              <Skeleton className="h-16 w-64 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
