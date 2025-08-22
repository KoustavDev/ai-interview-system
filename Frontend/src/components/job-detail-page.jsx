"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  User,
  Play,
  CheckCircle,
  Star,
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
import JobActionButton from "./jobActionButton";

export function JobDetailPage({ job, onStartInterview, onBack }) {
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  const handleStartInterview = async () => {
    setIsStartingInterview(true);

    try {
      const { success, title, description } = await onStartInterview(
        job.id,
        job.title
      );

      if (success) {
        toast(title, {
          description: description,
        });
      }
    } catch (error) {
      toast("Error", {
        description:
          error?.response?.data?.message ||
          "Failed to start interview. Please try again.",
      });
    } finally {
      setIsStartingInterview(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-6 -ml-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        )}

        {/* Job Header Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                    {job.title}
                  </h1>
                  <Badge
                    className={`${getJobTypeColor(
                      job.jobType
                    )} text-sm px-3 py-1`}
                  >
                    {job.jobType}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                    <span className="text-lg font-medium">{job.company}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{job.experienceLevel} experience</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-10">
                <div className="text-center lg:text-right">
                  <div className="flex items-center justify-center lg:justify-end gap-1 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Posted {formatDate(job.postedDate)}
                    </span>
                  </div>
                  {job.applicationDeadline && (
                    <div className="flex items-center justify-center lg:justify-end gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Apply by {formatDate(job.applicationDeadline)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Start Interview Button - Prominent */}
                {!job?.isRecruiter && (
                  <JobActionButton
                    handleStartInterview={handleStartInterview}
                    isStartingInterview={isStartingInterview}
                    status={job?.status}
                  />
                )}
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
            <div className="prose prose-lg max-w-none">
              {job.description.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-foreground leading-relaxed mb-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
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
            <CardDescription>
              The following skills are required for this position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {job.skillsRequired.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-base px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Responsibilities */}
        {job.responsibilities && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Key Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground leading-relaxed">
                      {responsibility}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        {job.requirements && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    <span className="text-foreground leading-relaxed">
                      {requirement}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {job.benefits && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Benefits & Perks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground leading-relaxed">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Bottom CTA Section */}
        {!job?.isRecruiter && (
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Ready to Apply?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Start your AI-powered interview now and take the first step
                  towards your next career opportunity.
                </p>
                <JobActionButton
                  handleStartInterview={handleStartInterview}
                  isStartingInterview={isStartingInterview}
                  status={job?.status}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
