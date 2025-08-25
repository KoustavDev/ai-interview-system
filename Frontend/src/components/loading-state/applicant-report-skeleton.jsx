import {
  ArrowLeft,
  User,
  Briefcase,
  Star,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicantReportSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 -ml-4" disabled>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applicants
        </Button>

        {/* Candidate Header Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <Avatar className="h-16 w-16 mx-auto sm:mx-0">
                <AvatarFallback>
                  <Skeleton className="h-full w-full rounded-full" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <Skeleton className="h-8 w-48 mb-2 mx-auto sm:mx-0" />
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Mail className="h-3 w-3" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Phone className="h-3 w-3" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Calendar className="h-3 w-3" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-end gap-1 mb-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex flex-wrap gap-1 justify-center sm:justify-end">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-5 w-16 rounded-full" />
                  ))}
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Job Applied Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Job Applied</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>

        {/* AI Score Card */}
        <Card className="mb-6 border-2 bg-blue-50 border-blue-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Evaluation Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <Skeleton className="h-12 w-16" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-4 w-32 mt-1 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Summary Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Summary</CardTitle>
            </div>
            <CardDescription>
              AI-generated evaluation summary based on the interview
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>

        {/* Interview Script Card */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Interview Transcript</CardTitle>
            </div>
            <CardDescription>
              Complete conversation between AI interviewer and candidate
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        i % 2 === 1 ? "bg-blue-500" : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <Skeleton
                        className={`h-3 w-20 mb-1 ${
                          i % 2 === 1 ? "bg-blue-100" : "bg-green-100"
                        }`}
                      />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        {i % 3 === 0 && <Skeleton className="h-4 w-3/4" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Skeleton className="h-12 flex-1 sm:flex-none sm:w-[150px]" />
          <Skeleton className="h-12 flex-1 sm:flex-none sm:w-[150px]" />
        </div>
      </div>
    </div>
  );
}
