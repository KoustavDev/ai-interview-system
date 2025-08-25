"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserX, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProfileNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-8 text-center ">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <UserX className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary mb-2">
              Profile Not Found
            </h1>
            <p className="text-foreground mb-4">
              We couldn't find the profile you're looking for.
            </p>
            <div className="text-sm text-red-600 bg-gray-50 rounded-lg p-3 border">
              <strong>Error Code:</strong> 404 - Profile Not Found
            </div>
          </div>

          {/* Possible Reasons */}
          <div className="mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">
              Possible reasons:
            </h3>
            <ul className="text-sm text-foreground space-y-1">
              <li>• The profile may have been deleted</li>
              <li>• The URL might be incorrect</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Retry Button */}
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
              variant="default"
            >
              Try Again
            </Button>

            {/* Go Back Button */}
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
