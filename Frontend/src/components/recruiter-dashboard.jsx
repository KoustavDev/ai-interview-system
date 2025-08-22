"use client"

import { useState } from "react"
import { Plus, Eye, Users, Code, Calendar, MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export function RecruiterDashboard({jobData }) {
  const router = useRouter()
  const [jobs] = useState(jobData);

  const handlePostNewJob = () => {
    router.push("/recruiter/post-job");
  }
  
  const handleViewApplicants = (jobId) => {
    router.push(`/recruiter/applicants/${jobId}`);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getApplicationsColor = (count) => {
    if (count >= 30) return "text-green-600"
    if (count >= 20) return "text-blue-600"
    if (count >= 10) return "text-orange-600"
    return "text-gray-600"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your job postings and track applications
            </p>
          </div>
          <Button
            onClick={handlePostNewJob}
            className="flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Jobs
                  </p>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold">
                    {jobs.reduce((sum, job) => sum + job.applications, 0)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. Applications
                  </p>
                  <p className="text-2xl font-bold">
                    {jobs.length > 0
                      ? Math.round(
                          jobs.reduce(
                            (sum, job) => sum + (Number(job.applications) || 0),
                            0
                          ) / jobs.length
                        )
                      : 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Job Postings</h2>
            <p className="text-sm text-muted-foreground">
              {jobs.length} active jobs
            </p>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-all duration-200 flex flex-col h-full"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {job.title}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Posted {formatDate(job.postedDate)}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {/* Skills */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Skills Required:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 4).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs px-2 py-0.5"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5 text-muted-foreground"
                          >
                            +{job.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Applications Count */}
                    <div className="flex items-center justify-center py-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Applications:
                        </span>
                        <span
                          className={`text-lg font-bold ${getApplicationsColor(
                            job.applications
                          )}`}
                        >
                          {job.applications}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplicants(job.id)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Applicants
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {jobs.length === 0 && (
            <div className="flex justify-center">
              <Card className="text-center py-12 max-w-md">
                <CardContent>
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Code className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="mb-2">No job postings yet</CardTitle>
                  <CardDescription className="mb-4">
                    Get started by posting your first job to attract talented
                    candidates.
                  </CardDescription>
                  <Button
                    onClick={handlePostNewJob}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Post Your First Job
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
