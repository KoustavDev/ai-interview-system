
import {
  User,
  Building2,
  Mail,
  FileText,
  Save,
  Camera,
  Upload,
  X,
  Phone,
  GraduationCap,
  Briefcase,
  Code,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function ProfileUpdateSkeleton({ role }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarFallback className="text-xl font-semibold bg-muted">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </AvatarFallback>
                </Avatar>

                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {/* Upload section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Upload className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Skeleton className="h-4 w-16" />
                </Button>
              </div>

              <Skeleton className="h-3 w-64 mx-auto" />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold">
                <Skeleton className="h-8 w-56 mx-auto" />
              </CardTitle>
              <CardDescription className="text-base mt-2">
                <Skeleton className="h-5 w-72 mx-auto" />
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-6">
              {/* Name Field (Read-only) */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  className="h-11 bg-muted/50"
                  disabled
                />
                <Skeleton className="h-3 w-32" />
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="h-11 bg-muted/50"
                  disabled
                />
                <Skeleton className="h-3 w-36" />
              </div>

              {/* Role-specific fields */}
              {role === "recruiter" ? (
                <>
                  {/* Company Field */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company
                    </Label>
                    <Input
                      placeholder="Enter your company name"
                      className="h-11"
                      disabled
                    />
                  </div>

                  {/* Position Field */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Position
                    </Label>
                    <Input
                      placeholder="e.g., Senior Technical Recruiter"
                      className="h-11"
                      disabled
                    />
                  </div>

                  {/* Contact Number Field */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Number
                    </Label>
                    <Input
                      placeholder="e.g., +1 (555) 123-4567"
                      className="h-11"
                      disabled
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Education Field */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </Label>
                    <Input
                      placeholder="e.g., Bachelor's in Computer Science"
                      className="h-11"
                      disabled
                    />
                  </div>

                  {/* Experience Field */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Experience
                    </Label>
                    <Input
                      placeholder="e.g., 4+ years in Full Stack Development"
                      className="h-11"
                      disabled
                    />
                  </div>

                  {/* Skills Field */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Skills
                    </Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Type a skill and press Enter"
                          className="h-11 flex-1"
                          disabled
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled
                          className="h-11 px-3 bg-transparent"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Skeleton className="h-4 w-16" />
                            <button
                              type="button"
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Number Field (optional for candidates) */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Number (Optional)
                    </Label>
                    <Input
                      placeholder="e.g., +1 (555) 123-4567"
                      className="h-11"
                      disabled
                    />
                  </div>

                  {/* Resume Upload Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="resume"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Resume
                    </Label>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300">
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto bg-muted">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <Skeleton className="h-4 w-64 mx-auto mb-2" />
                          <Skeleton className="h-3 w-48 mx-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* About Field */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  About
                </Label>
                <Textarea
                  placeholder={
                    role === "recruiter"
                      ? "Tell candidates about yourself, your experience, and what you're looking for..."
                      : "Tell recruiters about yourself, your experience, and what you're looking for..."
                  }
                  className="min-h-[120px] resize-none"
                  rows={5}
                  disabled
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/profile" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 bg-transparent"
                    disabled
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled
                  className="flex-1 h-11 text-base font-medium"
                >
                  <Save className="mr-2 h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </Button>
              </div>
            </form>
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
