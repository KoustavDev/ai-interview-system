"use client";
import { ArrowLeft, FileX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function ApplicantReportNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applicants
        </Button>

        {/* Error Card */}
        <Card className="text-center border-2  bg-background">
          <CardHeader className="pb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FileX className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-primary">
              Report Not Found
            </CardTitle>
            <CardDescription className="text-foreground text-base">
              We couldn't find the applicant report you're looking for.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="text-sm text-red-600 space-y-2">
                <div className="font-medium">404 - Report Not Found</div>
              </div>
            </div>

            {/* Possible Reasons */}
            <div className="text-left rounded-lg p-4 border">
              <h4 className="font-medium text-foreground mb-2">
                Possible reasons:
              </h4>
              <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
                <li>The report ID in the URL might be incorrect</li>
                <li>The interview hasn't been completed yet</li>
                <li>The AI evaluation is still being processed</li>
                <li>The report may have been deleted or archived</li>
                <li>You may not have permission to view this report</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
