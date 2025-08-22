"use client";

import { useState } from "react";
import {
  Download,
  Eye,
  User,
  Clock,
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ApplicantsList({ jobTitle, candidates, onDownloadResume }) {
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const handleDownloadResume = (candidateId, resumeUrl) => {
    onDownloadResume(candidateId, resumeUrl);
    // In a real app, this would trigger the download
    console.log(
      `Downloading resume for candidate ${candidateId}: ${resumeUrl}`
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
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

  const getStatusColor = (status) => {
    return status === "interviewed" || status === "shortlisted"
      ? "text-green-600 bg-green-50"
      : "text-orange-600 bg-orange-50";
  };

  const getAIScoreColor = (score) => {
    if (!score) return "text-gray-600";
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-orange-400";
    return "text-red-600";
  };

  const filteredCandidates = candidates.filter((candidate) => {
    if (filter === "all") return true;
    if (filter === "interviewed")
      return candidate.interviewStatus === "interviewed";
    if (filter === "shortlisted")
      return candidate.interviewStatus === "shortlisted";
    if (filter === "pending") return candidate.interviewStatus === "pending";
    return true;
  });

  const interviewedCount = candidates.filter(
    (c) => c.interviewStatus === "interviewed"
  ).length;
  const shortlistedCount = candidates.filter(
    (c) => c.interviewStatus === "shortlisted"
  ).length;
  const pendingCount = candidates.filter(
    (c) => c.interviewStatus === "pending"
  ).length;
  const rejectedCount = candidates.filter(
    (c) => c.interviewStatus === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Applicants for: <span className="text-primary">{jobTitle}</span>
          </h1>
          <p className="text-muted-foreground">
            Review and manage candidates who applied to this position
          </p>
        </div>

        {/* Stats and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Shortlisted:{" "}
                <span className="font-medium text-foreground">
                  {shortlistedCount}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Interviewed:{" "}
                <span className="font-medium text-foreground">
                  {interviewedCount}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Pending:{" "}
                <span className="font-medium text-foreground">
                  {pendingCount}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                Rejected:{" "}
                <span className="font-medium text-foreground">
                  {rejectedCount}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Total:{" "}
                <span className="font-medium text-foreground">
                  {candidates.length}
                </span>
              </span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({candidates.length})
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("shortlisted")}
            >
              Shortlisted ({shortlistedCount})
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("interviewed")}
            >
              Interviewed ({interviewedCount})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              Pending ({pendingCount})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("rejected")}
            >
              Rejected ({rejectedCount})
            </Button>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="hover:shadow-lg transition-all duration-200 flex flex-col h-full"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={candidate.avatar || "/placeholder.svg"}
                      alt={candidate.name}
                    />
                    <AvatarFallback className="text-sm font-semibold">
                      {getInitials(candidate.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight line-clamp-1">
                      {candidate.name}
                    </CardTitle>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Experience and Applied Date */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{candidate.experience}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(candidate.appliedDate)}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 text-muted-foreground"
                        >
                          +{candidate.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Status and AI Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {candidate.interviewStatus === "interviewed" && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                      {candidate.interviewStatus === "rejected" && (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                      {candidate.interviewStatus === "shortlisted" && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {candidate.interviewStatus === "pending" && (
                        <Clock className="h-4 w-4 text-orange-600" />
                      )}
                      <Badge
                        variant="secondary"
                        className={getStatusColor(candidate.interviewStatus)}
                      >
                        {candidate.interviewStatus}
                      </Badge>
                    </div>
                    {candidate.aiScore && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          AI Score
                        </p>
                        <p
                          className={`text-sm font-bold ${getAIScoreColor(
                            candidate.aiScore
                          )}`}
                        >
                          {candidate.aiScore}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDownloadResume(candidate.id, candidate.resumeUrl)
                    }
                    className="flex-1 flex items-center justify-center gap-1 bg-transparent"
                  >
                    <Download className="h-3 w-3" />
                    Resume
                  </Button>

                  <Button
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-1"
                    disabled={candidate.interviewStatus === "pending"}
                    onClick={() =>
                      router.push(`/recruiter/report/${candidate.id}`)
                    }
                  >
                    <Eye className="h-3 w-3" />
                    AI Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">No candidates found</CardTitle>
                <CardDescription>
                  {filter === "all"
                    ? "No candidates have applied to this job yet."
                    : `No candidates with ${filter} interview status.`}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
