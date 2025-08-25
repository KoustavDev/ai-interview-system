"use client";
import { ArrowLeft, Briefcase, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function JobNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <Briefcase className="h-12 w-12 text-red-500" />
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Job Not Found
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              We couldn't find the job you're looking for. It may have been
              removed or the link might be incorrect.
            </p>

            {/* Error Details */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <div className="text-sm font-medium text-foreground mb-2">
                Error Details:
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Status: 404 - Job Not Found</div>
              </div>
            </div>

            {/* Possible Reasons */}
            <div className="text-left mb-8">
              <h3 className="font-semibold text-foreground mb-3">
                This might have happened because:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  The job posting has been removed or expired
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  The job ID in the URL is incorrect or invalid
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  The job has been filled and is no longer accepting
                  applications
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  There might be a temporary server issue
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
