"use client";

import { useState } from "react";
import {
  CheckCircle,
  X,
  User,
  Briefcase,
  Calendar,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function ShortlistedCandidates({ candidates, onAction, status }) {
  const [candidateStates, setCandidateStates] = useState({});
  const [hiredCounts, setHiredCount] = useState(status.hired);
  const [rejectedCounts, setRejectedCount] = useState(status.rejected);

  const handleHire = async (candidateId, candidateName) => {
    setCandidateStates((prev) => ({
      ...prev,
      [candidateId]: { isProcessing: true, status: "hiring" },
    }));

    try {
      const success = await onAction(candidateId, "shortlisted");

      if (success) {
        setCandidateStates((prev) => ({
          ...prev,
          [candidateId]: { isProcessing: false, status: "hired" },
        }));

        setHiredCount((prev) => prev + 1);

        toast("Candidate Hired! 🎉", {
          description: `${candidateName} has been successfully hired.`,
        });
      }
    } catch (error) {
      setCandidateStates((prev) => ({
        ...prev,
        [candidateId]: { isProcessing: false, status: "shortlisted" },
      }));

      toast("Error", {
        description:
          error?.response?.data?.message ||
          "Failed to hire candidate. Please try again.",
      });
    }
  };

  const handleReject = async (candidateId, candidateName) => {
    setCandidateStates((prev) => ({
      ...prev,
      [candidateId]: { isProcessing: true, status: "rejecting" },
    }));

    try {
      const success = await onAction(candidateId, "rejected");

      if (success) {
        setCandidateStates((prev) => ({
          ...prev,
          [candidateId]: { isProcessing: false, status: "rejected" },
        }));

        setRejectedCount((prev) => prev + 1);

        toast("Candidate Rejected", {
          description: `${candidateName} has been rejected.`,
        });
      }
    } catch (error) {
      setCandidateStates((prev) => ({
        ...prev,
        [candidateId]: { isProcessing: false, status: "rejected" },
      }));

      toast("Error", {
        description:
          error?.response?.data?.message ||
          "Failed to reject candidate. Please try again.",
      });
    }
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

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 80) return "bg-blue-50 border-blue-200";
    if (score >= 70) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  const activeCandidates = candidates.filter((candidate) => {
    const state = candidateStates[candidate.id];
    return !state || (state.status !== "hired" && state.status !== "rejected");
  });

  const hiredCount = Object.values(candidateStates).filter(
    (s) => s.status === "hired"
  ).length;
  const rejectedCount = Object.values(candidateStates).filter(
    (s) => s.status === "rejected"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Shortlisted Candidates
            </h1>
          </div>
          <p className="text-muted-foreground">
            Make your final hiring decisions for top candidates
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Shortlisted",
              value: status.shortlisted,
              icon: <Users className="h-5 w-5 text-blue-600" />,
              bg: "bg-blue-100",
            },
            {
              label: "Hired",
              value: hiredCounts,
              icon: <CheckCircle className="h-5 w-5 text-green-600" />,
              bg: "bg-green-100",
            },
            {
              label: "Rejected",
              value: rejectedCounts,
              icon: <X className="h-5 w-5 text-red-600" />,
              bg: "bg-red-100",
            },
            {
              label: "Avg. Score",
              value: Math.round(
                activeCandidates.reduce((sum, c) => sum + c.aiScore, 0) /
                  activeCandidates.length || 0
              ),
              icon: <Star className="h-5 w-5 text-purple-600" />,
              bg: "bg-purple-100",
            },
          ].map(({ label, value, icon, bg }, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      label === "Hired"
                        ? "text-green-600"
                        : label === "Rejected"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {value}
                  </p>
                </div>
                <div
                  className={`h-10 w-10 ${bg} rounded-lg flex items-center justify-center`}
                >
                  {icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Candidates */}
        {activeCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeCandidates.map((candidate) => {
              const state = candidateStates[candidate.id] || {};
              const isProcessing = state.isProcessing;

              return (
                <Card
                  key={candidate.id}
                  className="relative flex flex-col h-full hover:shadow-lg transition-all"
                >
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                        <p className="text-sm font-medium">
                          {state.status === "hiring"
                            ? "Hiring..."
                            : "Rejecting..."}
                        </p>
                      </div>
                    </div>
                  )}

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
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight line-clamp-1">
                          {candidate.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground truncate">
                          {candidate.email}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 flex flex-col flex-1">
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Job Applied:
                          </span>
                        </div>
                        <p className="text-sm font-medium">
                          {candidate.jobTitle}
                        </p>
                      </div>

                      <div
                        className={`p-3 rounded-lg border ${getScoreBackground(
                          candidate.aiScore
                        )}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">
                              AI Score:
                            </span>
                          </div>
                          <div
                            className={`text-lg font-bold ${getScoreColor(
                              candidate.aiScore
                            )}`}
                          >
                            {candidate.aiScore}
                            <span className="text-sm text-muted-foreground">
                              /{candidate.maxScore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {candidate.experience} experience
                          </span>
                        </div>
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

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Applied: {formatDate(candidate.applicationDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Interviewed: {formatDate(candidate.interviewDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleReject(candidate.id, candidate.name)
                        }
                        disabled={isProcessing}
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 bg-white"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleHire(candidate.id, candidate.name)}
                        disabled={isProcessing}
                        className="flex-1 text-green-600 border-green-200 hover:bg-green-50 bg-white"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Hire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">
                  No Shortlisted Candidates
                </CardTitle>
                <CardDescription>
                  {hiredCount > 0 || rejectedCount > 0
                    ? "All shortlisted candidates have been processed."
                    : "You haven't shortlisted any candidates yet."}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
