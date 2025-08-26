import { User, Mail, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarFallback className="text-xl font-semibold bg-muted">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                <Skeleton className="h-8 w-48 mx-auto" />
              </CardTitle>
              <CardDescription className="text-base mt-2">
                <Skeleton className="h-5 w-64 mx-auto" />
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                Full Name
              </div>
              <Skeleton className="h-6 w-48" />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
              <Skeleton className="h-6 w-64" />
            </div>

            {/* About Field */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                About
              </div>
              <div className="text-base text-foreground leading-relaxed bg-muted/30 rounded-lg p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="pt-4">
              <Button disabled className="w-full h-11 text-base font-medium">
                <User className="mr-2 h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
