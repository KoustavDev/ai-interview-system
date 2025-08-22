"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Building2,
  Mail,
  FileText,
  Save,
  Camera,
  Upload,
  X,
  Eye,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  recruiterProfileUpdateSchema,
  candidateProfileUpdateSchema,
} from "@/lib/validation";
import Link from "next/link";

export function ProfileUpdatePage({ initialData, onUpdateProfile }) {
  const [skillInput, setSkillInput] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [pendingResume, setPendingResume] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Set up form based on role
  const isRecruiter = initialData.role === "recruiter";

  const recruiterForm = useForm({
    resolver: zodResolver(recruiterProfileUpdateSchema),
    defaultValues: isRecruiter
      ? {
          company: initialData.company,
          position: initialData.position,
          about: initialData.about,
          contactNumber: initialData.contactNumber,
        }
      : undefined,
  });

  const candidateForm = useForm({
    resolver: zodResolver(candidateProfileUpdateSchema),
    defaultValues: !isRecruiter
      ? {
          education: initialData.education,
          experience: initialData.experience,
          about: initialData.about,
          skills: initialData.skills,
          // contactNumber: initialData.contactNumber || "",
        }
      : undefined,
  });

  const form = isRecruiter ? recruiterForm : candidateForm;

  // Watch for form changes
  const watchedValues = form.watch();

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        checkForChanges();
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    checkForChanges();
  }, [pendingAvatar, pendingResume, watchedValues]);

  const checkForChanges = () => {
    const currentValues = form.getValues();
    let hasFormChanges = false;

    if (isRecruiter) {
      const recruiterData = initialData;
      const recruiterValues = currentValues;
      hasFormChanges =
        recruiterValues.company !== recruiterData.company ||
        recruiterValues.position !== recruiterData.position ||
        recruiterValues.about !== recruiterData.about ||
        recruiterValues.contactNumber !== recruiterData.contactNumber;
    } else {
      const candidateData = initialData;
      const candidateValues = currentValues;
      hasFormChanges =
        candidateValues.education !== candidateData.education ||
        candidateValues.experience !== candidateData.experience ||
        candidateValues.about !== candidateData.about ||
        JSON.stringify(candidateValues.skills) !==
          JSON.stringify(candidateData.skills);
    }

    const hasMediaChanges = pendingAvatar !== null || pendingResume !== null;

    setHasChanges(hasFormChanges || hasMediaChanges);
  };

  const handleSkillAdd = () => {
    if (!isRecruiter && skillInput.trim()) {
      const currentSkills = form.getValues("skills");
      if (!currentSkills.includes(skillInput.trim())) {
        const newSkills = [...currentSkills, skillInput.trim()];
        form.setValue("skills", newSkills, { shouldValidate: true });
        setSkillInput("");
      }
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    if (!isRecruiter) {
      const currentSkills = form.getValues("skills");
      const newSkills = currentSkills.filter(
        (skill) => skill !== skillToRemove
      );
      form.setValue("skills", newSkills, { shouldValidate: true });
    }
  };

  const handleSkillInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillAdd();
    }
  };

  const handleAvatarSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast("Invalid File Type", {
        description: "Please select an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast("File Too Large", {
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setPendingAvatar(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleResumeSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF, DOC, DOCX)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast("Invalid File Type", {
        description: "Please select a PDF, DOC, or DOCX file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast("File Too Large", {
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setPendingResume(file);
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setResumePreview({
      name: file.name,
      size: `${fileSizeInMB} MB`,
    });
  };

  const handleRemoveAvatar = () => {
    setPendingAvatar(null);
    setAvatarPreview(null);
  };

  const handleRemoveResume = () => {
    setPendingResume(null);
    setResumePreview(null);
  };

  const handleViewResume = () => {
    if (!isRecruiter) {
      const candidateData = initialData;
      if (candidateData.resume?.fileUrl) {
        window.open(candidateData.resume.fileUrl, "_blank");
      }
    }
  };

  const triggerAvatarInput = () => {
    document.getElementById("avatar-upload")?.click();
  };

  const triggerResumeInput = () => {
    document.getElementById("resume-upload")?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const mockEvent = {
        target: { files: [file] },
      };
      handleResumeSelect(mockEvent);
    }
  };

  const onSubmit = async (values) => {
    try {
      // Simulate avatar upload if pending
      let avatarUrl = initialData.avatar;
      if (pendingAvatar) {
        // Simulate upload delay
        // await new Promise((resolve) => setTimeout(resolve, 1000))
        avatarUrl = pendingAvatar;
      }

      // Simulate resume upload if pending
      let resumeData = !isRecruiter ? initialData.resume : undefined;
      if (pendingResume && !isRecruiter) {
        // Simulate upload delay
        // await new Promise((resolve) => setTimeout(resolve, 1500))
        // const fileSizeInMB = (pendingResume.size / (1024 * 1024)).toFixed(2)
        resumeData = pendingResume;
      }

      // Prepare updated profile data
      let updatedData;
      if (isRecruiter) {
        const recruiterValues = values;
        updatedData = {
          ...initialData,
          ...recruiterValues,
          avatar: avatarUrl,
        };
      } else {
        const candidateValues = values;
        updatedData = {
          ...initialData,
          ...candidateValues,
          avatar: avatarUrl,
          resume: resumeData,
        };
      }

      if (onUpdateProfile) {
        await onUpdateProfile(updatedData);
      }

      toast("Profile Updated", {
        description: "Your profile has been successfully updated.",
      });

      // Reset pending states
      setPendingAvatar(null);
      setPendingResume(null);
      setAvatarPreview(null);
      setResumePreview(null);
      setHasChanges(false);
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message:
          error?.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
      toast("Error", {
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const userInitials = initialData.name
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

  const currentAvatar = avatarPreview || initialData.avatar;
  const currentResume = !isRecruiter ? initialData.resume.fileUrl : undefined;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={currentAvatar} alt={initialData.name} />
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={triggerAvatarInput}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />

            {/* Upload section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={triggerAvatarInput}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Upload className="h-4 w-4" />
                  {pendingAvatar ? "Change Selected Photo" : "Change Photo"}
                </Button>

                {(currentAvatar || pendingAvatar) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove Photo
                  </Button>
                )}
              </div>

              {pendingAvatar && (
                <p className="text-xs text-blue-600 text-center">
                  New photo selected. Click "Update Profile" to save changes.
                </p>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Recommended: Square image, at least 200x200px, max 5MB
              </p>
            </div>

            <div>
              <CardTitle className="text-2xl font-bold">
                Update{" "}
                {initialData.role === "recruiter" ? "Recruiter" : "Candidate"}{" "}
                Profile
              </CardTitle>
              <CardDescription className="text-base">
                Update your profile information (name and email cannot be
                changed)
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                    value={initialData.name}
                    className="h-11 bg-muted/50"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Name cannot be changed
                  </p>
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
                    value={initialData.email}
                    className="h-11 bg-muted/50"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                {/* Role-specific fields */}
                {isRecruiter ? (
                  <>
                    {/* Company Field */}
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Company
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your company name"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Position Field */}
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Position
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Senior Technical Recruiter"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact Number Field */}
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Contact Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., +1 (555) 123-4567"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <>
                    {/* Education Field */}
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Education
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Bachelor's in Computer Science"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Experience Field */}
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Experience
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 4+ years in Full Stack Development"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Skills Field */}
                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Skills
                          </FormLabel>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                value={skillInput || ""}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={handleSkillInputKeyPress}
                                placeholder="Type a skill and press Enter"
                                className="h-11 flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleSkillAdd}
                                disabled={!skillInput.trim()}
                                className="h-11 px-3 bg-transparent"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {field.value.length > 0 && (
                              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
                                {field.value.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {skill}
                                    <button
                                      type="button"
                                      onClick={() => handleSkillRemove(skill)}
                                      className="ml-1 hover:text-destructive"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact Number Field (optional for candidates) */}
                    {/* <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Contact Number (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., +1 (555) 123-4567" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    {/* Resume Upload Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="resume"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Resume
                      </Label>

                      {/* Hidden file input */}
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeSelect}
                        className="hidden"
                      />

                      {resumePreview ? (
                        /* Pending Resume Display */
                        <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-800">
                                  {resumePreview.name}
                                </p>
                                <p className="text-xs text-blue-600">
                                  {resumePreview.size} • Selected for upload
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveResume}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : currentResume ? (
                        /* Existing Resume Display */
                        <div className="border-2 border-dashed border-green-200 bg-green-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-green-800">
                                  {initialData.resume.fileName}
                                </p>
                                <p className="text-xs text-green-600">
                                  {initialData.resume.fileSize} • Uploaded{" "}
                                  {formatDate(initialData.resume.uploadDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleViewResume}
                                className="text-green-600 hover:text-green-700 hover:bg-green-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={triggerResumeInput}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Upload Area */
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
                            isDragOver
                              ? "border-primary bg-primary/5 scale-105"
                              : "border-gray-300 hover:border-primary/50"
                          }`}
                          onClick={triggerResumeInput}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <div className="space-y-3">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto transition-colors ${
                                isDragOver ? "bg-primary/10" : "bg-muted"
                              }`}
                            >
                              <Upload
                                className={`h-6 w-6 transition-colors ${
                                  isDragOver
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div>
                              <p
                                className={`text-sm font-medium transition-colors ${
                                  isDragOver
                                    ? "text-primary"
                                    : "text-foreground"
                                }`}
                              >
                                {isDragOver
                                  ? "Drop your resume here"
                                  : "Drag & drop your resume or click to browse"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOC, or DOCX (max 10MB)
                              </p>
                            </div>
                            {isDragOver && (
                              <div className="flex items-center justify-center gap-2 text-primary">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* About Field */}
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        About
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            isRecruiter
                              ? "Tell candidates about yourself, your experience, and what you're looking for..."
                              : "Tell recruiters about yourself, your experience, and what you're looking for..."
                          }
                          className="min-h-[120px] resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link href="/profile" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 bg-transparent"
                      disabled={form.formState.isSubmitting}
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || !hasChanges}
                    className="flex-1 h-11 text-base font-medium"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Your profile information helps{" "}
                {initialData.role === "recruiter"
                  ? "candidates understand who you are"
                  : "recruiters learn about your background"}{" "}
                and builds trust in the{" "}
                {initialData.role === "recruiter"
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
