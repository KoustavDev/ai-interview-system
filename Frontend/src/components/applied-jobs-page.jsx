"use client"

import { useState } from "react"
import { Briefcase, Building2, Calendar, Mail, Phone, Clock, CheckCircle, X, Eye, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner";



// Sample applied jobs data
const sampleAppliedJobs = [
  {
    id: "1",
    jobTitle: "Senior Full Stack Developer",
    companyName: "TechCorp Solutions",
    applicationDate: "2024-01-20",
    status: "Shortlisted",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$120k - $160k",
    hrContact: {
      name: "Sarah Johnson",
      email: "sarah.johnson@techcorp.com",
      phone: "+1 (555) 123-4567",
    },
  },
  {
    id: "2",
    jobTitle: "Frontend React Developer",
    companyName: "InnovateTech",
    applicationDate: "2024-01-18",
    status: "interviewed",
    location: "New York, NY",
    jobType: "Full-time",
    salary: "$90k - $130k",
  },
  {
    id: "3",
    jobTitle: "DevOps Engineer",
    companyName: "CloudScale Inc",
    applicationDate: "2024-01-16",
    status: "Shortlisted",
    location: "Remote",
    jobType: "Remote",
    salary: "$110k - $150k",
    hrContact: {
      name: "Michael Chen",
      email: "michael.chen@cloudscale.com",
    },
  },
  {
    id: "4",
    jobTitle: "UI/UX Designer",
    companyName: "DesignStudio Pro",
    applicationDate: "2024-01-15",
    status: "Rejected",
    location: "Austin, TX",
    jobType: "Full-time",
    salary: "$80k - $110k",
  },
  {
    id: "5",
    jobTitle: "Data Scientist",
    companyName: "DataInsights Corp",
    applicationDate: "2024-01-14",
    status: "Pending",
    location: "Seattle, WA",
    jobType: "Full-time",
    salary: "$130k - $170k",
  },
  {
    id: "6",
    jobTitle: "Junior Software Engineer",
    companyName: "StartupHub",
    applicationDate: "2024-01-12",
    status: "interviewed",
    location: "Boston, MA",
    jobType: "Full-time",
    salary: "$70k - $90k",
  },
]

export function AppliedJobsPage({ jobs = sampleAppliedJobs, onContactHR, onViewDetails }) {
  const [filter, setFilter] = useState("all")

  const handleContactHR = (jobId, jobTitle, hrContact) => {
    if (!hrContact) return

    onContactHR?.(jobId, hrContact)

    // In a real app, this might open an email client or contact modal
    toast("Contact Information", {
      description: `Opening contact for ${hrContact.name} regarding ${jobTitle}`,
    });

    // Example: Open email client
    const subject = encodeURIComponent(`Regarding ${jobTitle} Application`)
    const body = encodeURIComponent(
      `Dear ${hrContact.name},\n\nI hope this email finds you well. I am writing regarding my application for the ${jobTitle} position.\n\nBest regards`,
    )
    window.open(`mailto:${hrContact.email}?subject=${subject}&body=${body}`)
  }

  const handleViewDetails = (jobId) => {
    onViewDetails?.(jobId)
    console.log(`Viewing details for job ${jobId}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "interviewed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shortlisted":
        return "bg-green-50 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-3 w-3" />;
      case "interviewed":
        return <Eye className="h-3 w-3" />;
      case "shortlisted":
        return <CheckCircle className="h-3 w-3" />;
      case "Rejected":
        return <X className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  }

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true
    if (filter === "interviewed") return job.status === "interviewed";
    return job.status.toLowerCase().replace(" ", "-") === filter
  })

  // Calculate stats
  const totalApplications = jobs.length
  const pendingCount = jobs.filter((job) => job.status === "pending").length
  const interviewedCount = jobs.filter((job) => job.status === "interviewed").length
  const shortlistedCount = jobs.filter(
    (job) => job.status === "shortlisted"
  ).length;
  const rejectedCount = jobs.filter((job) => job.status === "rejected").length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Applications
          </h1>
          <p className="text-muted-foreground">
            Track the status of your job applications
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">
                {totalApplications}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {interviewedCount}
              </div>
              <div className="text-sm text-muted-foreground">interviewed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {shortlistedCount}
              </div>
              <div className="text-sm text-muted-foreground">Shortlisted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {rejectedCount}
              </div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({totalApplications})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={filter === "in-review" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("interviewed")}
          >
            interviewed ({interviewedCount})
          </Button>
          <Button
            variant={filter === "shortlisted" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("shortlisted")}
          >
            Shortlisted ({shortlistedCount})
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("rejected")}
          >
            Rejected ({rejectedCount})
          </Button>
        </div>

        {/* Job Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={`hover:shadow-lg transition-all duration-200 flex flex-col h-full ${
                job.status === "shortlisted" ? "ring-2 ring-green-200" : ""
              }`}
            >
              <CardContent className="p-6 flex-1 flex flex-col">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {job.jobTitle} {job.status === "shortlisted" && "lol"}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium truncate">
                        {job.companyName}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      job.status
                    )} flex items-center gap-1 px-2 py-1 text-xs flex-shrink-0 ml-2`}
                  >
                    {getStatusIcon(job.status)}
                    {job.status}
                  </Badge>
                </div>

                {/* Job Details */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span>Applied {formatDate(job.applicationDate)}</span>
                  </div>

                  {job.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-xs">📍</span>
                      <span className="truncate">{job.location}</span>
                    </div>
                  )}

                  {job.jobType && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-3 w-3 flex-shrink-0" />
                      <span>{job.jobType}</span>
                    </div>
                  )}

                  {job.salary && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-xs">💰</span>
                      <span className="truncate">{job.salary}</span>
                    </div>
                  )}
                </div>

                {/* HR Contact Info for Shortlisted */}
                {job.status === "shortlisted" && job.hrContact.name && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-green-800 mb-2">
                      HR Contact:
                    </p>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-green-700">
                        {job.hrContact.name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{job.hrContact.email}</span>
                      </div>
                      {job.hrContact.phone && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Phone className="h-3 w-3" />
                          <span>{job.hrContact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(job.jobId)}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Details
                  </Button>

                  {job.status === "shortlisted" && job.hrContact && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleContactHR(job.id, job.jobTitle, job.hrContact)
                      }
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                    >
                      <Mail className="h-3 w-3" />
                      Contact HR
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">
                  {filter === "all"
                    ? "No Applications Yet"
                    : `No ${filter.replace("-", " ")} Applications`}
                </CardTitle>
                <CardDescription>
                  {filter === "all"
                    ? "Start applying to jobs to see them here."
                    : `You don't have any ${filter.replace(
                        "-",
                        " "
                      )} applications at the moment.`}
                </CardDescription>
                {filter === "all" && (
                  <Button
                    className="mt-4"
                    onClick={() => console.log("Navigate to job listings")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Jobs
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shortlisted Highlight */}
        {shortlistedCount > 0 && filter === "all" && (
          <Card className="mt-8 border-2 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">
                    Congratulations! You have {shortlistedCount} shortlisted
                    application
                    {shortlistedCount > 1 ? "s" : ""}
                  </h3>
                  <p className="text-sm text-green-700">
                    Don't forget to contact HR for your shortlisted applications
                    to move forward in the process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
