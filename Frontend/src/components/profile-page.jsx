import {
  User,
  Building2,
  Mail,
  FileText,
  Phone,
  GraduationCap,
  Briefcase,
  Code,
  Eye,
  Download,
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
import Link from "next/link";
import { useAuthProvider } from "@/context/AuthProvider";

export function ProfilePage({ profileData }) {
  const { user } = useAuthProvider();
  const isEditable = profileData.id === user?.id;

  const userInitials = profileData?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {profileData.role === "recruiter"
                  ? "Recruiter Profile"
                  : "Candidate Profile"}
              </CardTitle>
              <CardDescription className="text-base">
                {profileData.role === "recruiter"
                  ? "Your professional recruiter information"
                  : "Your professional candidate profile"}
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
              <div className="text-base font-medium text-foreground">
                {profileData.name}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
              <div className="text-base text-foreground">
                {profileData.email}
              </div>
            </div>

            {/* Role-specific fields */}
            {profileData.role === "recruiter" ? (
              <>
                {/* Company Field */}
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Company
                  </div>
                  <div className="text-base text-foreground">
                    {profileData.company}
                  </div>
                </div>

                {/* Position Field */}
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    Position
                  </div>
                  <div className="text-base text-foreground">
                    {profileData.position}
                  </div>
                </div>

                {/* Contact Number Field */}
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    Contact Number
                  </div>
                  <div className="text-base text-foreground">
                    {profileData.contactNumber}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Education Field */}
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </div>
                  <div className="text-base text-foreground">
                    {profileData.education}
                  </div>
                </div>

                {/* Experience Field */}
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    Experience
                  </div>
                  <div className="text-base text-foreground">
                    {profileData.experience}
                  </div>
                </div>

                {/* Skills Field */}
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Code className="h-4 w-4" />
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Number Field (optional for candidates) */}
                {profileData.contactNumber && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      Contact Number
                    </div>
                    <div className="text-base text-foreground">
                      {profileData.contactNumber}
                    </div>
                  </div>
                )}

                {/* Resume Field */}
                {profileData.resume.fileUrl && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Resume
                    </div>
                    <div className="border-2 border-dashed border-green-200 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              {profileData.resume.fileName}
                            </p>
                            <p className="text-xs text-green-600">
                              {profileData.resume.fileSize} • Uploaded{" "}
                              {formatDate(profileData.resume.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* View Resume */}
                          <a
                            href={profileData.resume.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 hover:bg-green-100 p-2 rounded-lg"
                            aria-label="View Resume"
                          >
                            <Eye className="h-4 w-4" />
                          </a>

                          {/* Download Resume */}
                          <a
                            href={profileData.resume.fileUrl}
                            download={profileData.resume.fileName}
                            className="text-green-600 hover:text-green-700 hover:bg-green-100 p-2 rounded-lg"
                            aria-label="Download Resume"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* About Field */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                About
              </div>
              <div className="text-base text-foreground leading-relaxed bg-muted/30 rounded-lg p-4">
                {profileData.about}
              </div>
            </div>

            {/* Edit Profile Button */}
            {isEditable && (
              <div className="pt-4">
                <Link href={`/profile/${user.id}/update`}>
                  <Button className="w-full h-11 text-base font-medium">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Your profile information helps{" "}
                {profileData.role === "recruiter"
                  ? "candidates understand who you are"
                  : "recruiters learn about your background"}{" "}
                and builds trust in the{" "}
                {profileData.role === "recruiter"
                  ? "recruitment"
                  : "application"}{" "}
                process.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
