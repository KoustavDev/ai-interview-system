"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Send,
  Building2,
  Clock,
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CandidateDashboard({ jobs, onApply, ref, hasNextPage }) {
  const router = useRouter();
  const [appliedJobs, setAppliedJobs] = useState(
    new Set(jobs.filter((job) => job.isApplied).map((job) => job.id))
  );
  const [processingJobs, setProcessingJobs] = useState(new Set());

  const handleApply = async (jobId, jobTitle) => {
    if (appliedJobs.has(jobId)) return;

    setProcessingJobs((prev) => new Set(prev).add(jobId));
    try {
      setAppliedJobs((prev) => new Set(prev).add(jobId));
      const success = await onApply(jobId);

      if (success) {
        toast("Application Submitted! 🎉", {
          description: `Your application for ${jobTitle} has been submitted successfully.`,
        });
      }
    } catch (error) {
      toast("Application Failed", {
        description:
          error?.response?.data?.message ||
          "Failed to submit application. Please try again.",
      });
    } finally {
      setProcessingJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    setAppliedJobs((prev) => {
      const newSet = new Set(prev);
      jobs.forEach((job) => {
        if (job.isApplied) newSet.add(job.id);
      });
      return newSet;
    });
  }, [jobs]);

  const handleReadMore = (jobId) => {
    router.push(`/candidate/job/${jobId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getJobTypeColor = (jobType) => {
    switch (jobType) {
      case "Remote":
        return "bg-green-50 text-green-700 border-green-200";
      case "Full-time":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Part-time":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Contract":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Hybrid":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const availableJobs = jobs.length;
  const appliedCount = appliedJobs.size;
  const newJobs = jobs.filter((job) => {
    const postedDate = new Date(job.postedDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return postedDate > weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Job Opportunities
          </h1>
          <p className="text-muted-foreground">
            Discover your next career opportunity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Available Jobs
                  </p>
                  <p className="text-2xl font-bold">{availableJobs}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Applications Sent
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {appliedCount}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    New This Week
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {newJobs}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const isApplied = appliedJobs.has(job.id);
            const isProcessing = processingJobs.has(job.id);

            return (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-all duration-200 flex flex-col h-full relative"
              >
                {/* Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        Submitting Application...
                      </p>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg leading-tight line-clamp-2 flex-1">
                      {job.title}
                    </CardTitle>
                    {job.jobType && (
                      <Badge
                        className={`shrink-0 text-xs ${getJobTypeColor(
                          job.jobType
                        )}`}
                      >
                        {job.jobType}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{job.company}</span>
                    </div>
                    {job.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {/* Job Description */}
                    <div>
                      <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                        {job.description}
                      </p>
                    </div>

                    {/* Skills Required */}
                    {job.skillsRequired.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Skills Required:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {job.skillsRequired.slice(0, 4).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs px-2 py-0.5"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {job.skillsRequired.length > 4 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5 text-muted-foreground"
                            >
                              +{job.skillsRequired.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Job Details */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Posted {formatDate(job.postedDate)}</span>
                      </div>
                      {job.applicationDeadline && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Apply by {formatDate(job.applicationDeadline)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{job.experienceLevel} experience</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReadMore(job.id)}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-1 text-primary hover:text-primary"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Read more...
                    </Button>
                    <Button
                      variant={isApplied ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleApply(job.id, job.title)}
                      disabled={isApplied || isProcessing}
                      className={`cursor-pointer flex-1 flex items-center justify-center gap-1 ${
                        isApplied
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
                          : "bg-white hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Send className="h-3 w-3" />
                          Applied
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          Apply
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">No Jobs Available</CardTitle>
                <CardDescription>
                  Check back later for new job opportunities.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}
        {hasNextPage && (
          <div ref={ref}>
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">
                  Loading more jobs...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
