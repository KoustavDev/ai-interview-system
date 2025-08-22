"use client";

import { toast } from "sonner";
import { useState } from "react";
import {
  ArrowLeft,
  User,
  Briefcase,
  Star,
  FileText,
  MessageSquare,
  CheckCircle,
  X,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ApplicantReport({ reportData, onBack, onAction }) {
  const [isShortlisting, setIsShortlisting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleSortlist = async () => {
    setIsShortlisting(true);
    try {
      const success = await onAction(reportData.candidateId, "shortlisted");

      if (success) {
        toast("Candidate Sortlisted", {
          description: `${reportData.candidateName} has been added to your sortlist.`,
        });
      }
    } catch (error) {
      toast("Error", {
        description:
          error?.response?.data?.message ||
          "Failed to sortlist candidate. Please try again.",
      });
    } finally {
      setIsShortlisting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const success = await onAction(reportData.candidateId, "rejected");

      if (success) {
        toast("Candidate Rejected", {
          description: `${reportData.candidateName} has been rejected.`,
        });
      }
    } catch (error) {
      toast("Error", {
        description:
          error?.response?.data?.message ||
          "Failed to reject candidate. Please try again.",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return "bg-green-50 dark:bg-green-900 border-green-200";
    if (score >= 80) return "bg-blue-50 dark:bg-blue-900 border-blue-200";
    if (score >= 70) return "bg-orange-50 dark:bg-orange-900 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-6 -ml-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applicants
          </Button>
        )}

        {/* Candidate Header Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <Avatar className="h-16 w-16 mx-auto sm:mx-0">
                <AvatarImage
                  src={reportData.candidateAvatar || "/placeholder.svg"}
                  alt={reportData.candidateName}
                />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(reportData.candidateName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <CardTitle className="text-2xl mb-2">
                  {reportData.candidateName}
                </CardTitle>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{reportData.candidateEmail}</span>
                  </div>
                  {reportData.candidatePhone && (
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{reportData.candidatePhone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center sm:justify-start gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Applied on {formatDate(reportData.appliedDate)}</span>
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-end gap-1 mb-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {reportData.experience} experience
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 justify-center sm:justify-end">
                  {reportData.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {reportData.skills.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs text-muted-foreground"
                    >
                      +{reportData.skills.length - 3}
                    </Badge>
                  )}
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
            <p className="text-xl font-semibold text-primary">
              {reportData.jobTitle}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Interview conducted on {formatDate(reportData.interviewDate)}
            </p>
          </CardContent>
        </Card>

        {/* AI Score Card */}
        <Card
          className={`mb-6 border-2 ${getScoreBackground(reportData.aiScore)}`}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">AI Evaluation Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${getScoreColor(
                    reportData.aiScore
                  )}`}
                >
                  {reportData.aiScore}
                  <span className="text-2xl text-muted-foreground">
                    /{reportData.maxScore}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Overall Performance
                </p>
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
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed text-foreground">
                {reportData.summary}
              </p>
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
                {Array.isArray(reportData.interviewScript)
                  ? reportData.interviewScript.map((exchange, index) => {
                      const isInterviewer =
                        exchange.sender === "AI Interviewer";
                      return (
                        <div
                          key={index}
                          className={`flex gap-3 ${
                            isInterviewer ? "justify-start" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                              isInterviewer ? "bg-blue-500" : "bg-green-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-xs font-medium mb-1 ${
                                isInterviewer
                                  ? "text-blue-600"
                                  : "text-green-600"
                              }`}
                            >
                              {exchange.sender}
                            </p>
                            <p className="text-sm text-foreground leading-relaxed">
                              {exchange.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  : reportData.interviewScript
                      .split("\n\n")
                      .map((exchange, index) => {
                        const isInterviewer =
                          exchange.startsWith("AI Interviewer:");
                        const speaker = isInterviewer
                          ? "AI Interviewer:"
                          : `${reportData.candidateName}:`;
                        const content = exchange.replace(
                          /^(AI Interviewer:|[^:]+:)\s*/,
                          ""
                        );

                        return (
                          <div
                            key={index}
                            className={`flex gap-3 ${
                              isInterviewer ? "justify-start" : "justify-start"
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                isInterviewer ? "bg-blue-500" : "bg-green-500"
                              }`}
                            />
                            <div className="flex-1">
                              <p
                                className={`text-xs font-medium mb-1 ${
                                  isInterviewer
                                    ? "text-blue-600"
                                    : "text-green-600"
                                }`}
                              >
                                {speaker}
                              </p>
                              <p className="text-sm text-foreground leading-relaxed">
                                {content}
                              </p>
                            </div>
                          </div>
                        );
                      })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleReject}
            variant="outline"
            size="lg"
            disabled={isRejecting || reportData.status === "rejected"}
            className="flex-1 sm:flex-none sm:min-w-[150px] h-12 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            {isRejecting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Reject
              </>
            )}
          </Button>
          <Button
            onClick={handleSortlist}
            size="lg"
            disabled={isShortlisting || reportData.status === "shortlisted"}
            className="flex-1 sm:flex-none sm:min-w-[150px] h-12"
          >
            {isShortlisting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Sortlist
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
