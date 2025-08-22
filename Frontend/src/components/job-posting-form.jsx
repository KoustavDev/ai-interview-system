"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Briefcase,
  FileText,
  Code,
  Clock,
  MapPin,
  DollarSign,
  Plus,
  X,
  Users,
  Gift,
  CheckCircle,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { jobPostingSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

const experienceOptions = [
  { value: "fresher", label: "Fresher (0 years)" },
  { value: "1-2", label: "1-2 years" },
  { value: "2-4", label: "2-4 years" },
  { value: "4-6", label: "4-6 years" },
  { value: "6-8", label: "6-8 years" },
  { value: "8+", label: "8+ years" },
];

const jobTypeOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

export function JobPostingForm({ onSubmit, onCancel, isLoading }) {
  const [skillInput, setSkillInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");

  const form = useForm({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: [],
      experience: "",
      location: "",
      salary: "",
      jobType: "",
      deadline: null,
      responsibilities: [],
      benefits: [],
      requirements: [],
    },
  });

  const { watch, setValue, getValues } = form;

  const watchedSkills = watch("skills");
  const watchedResponsibilities = watch("responsibilities");
  const watchedBenefits = watch("benefits");
  const watchedRequirements = watch("requirements");

  const handleAddItem = (type, input, setInput) => {
    if (input.trim()) {
      const currentItems = getValues(type);
      if (!currentItems.includes(input.trim())) {
        setValue(type, [...currentItems, input.trim()], {
          shouldValidate: true,
        });
        setInput("");
      }
    }
  };

  const handleRemoveItem = (type, itemToRemove) => {
    const currentItems = getValues(type);
    setValue(
      type,
      currentItems.filter((item) => item !== itemToRemove),
      { shouldValidate: true }
    );
  };

  const handleKeyPress = (e, type, input, setInput) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem(type, input, setInput);
    }
  };

  const onFormSubmit = async (data) => {
    try {
      const success = await onSubmit(data);

      if (success) {
        toast("Job Posted Successfully!", {
          description: "Your job posting has been published and is now live.",
        });

        // Reset form
        form.reset();
        setSkillInput("");
        setResponsibilityInput("");
        setBenefitInput("");
        setRequirementInput("");
      } else {
        toast("Error", {
          description: error?.response?.data?.message || "Failed to post job. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message:
          error?.response?.data?.message ||
          "Failed to post job. Please try again.",
      });
      toast("Error", {
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Post New Job</CardTitle>
            <CardDescription className="text-base">
              Create a new job posting to attract talented candidates
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-6"
              >
                {/* Job Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Job Title *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Senior Full Stack Developer"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Job Type and Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Job Type *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobTypeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., San Francisco, CA"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Experience and Salary Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Experience Required *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {experienceOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Salary Range
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., $80k - $120k"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Deadline */}
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Application Deadline
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-11 pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date (optional)</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Skills Required */}
                <FormField
                  control={form.control}
                  name="skills"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Skills Required *
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) =>
                              handleKeyPress(
                                e,
                                "skills",
                                skillInput,
                                setSkillInput
                              )
                            }
                            placeholder="Type a skill and press Enter"
                            className="h-11 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              handleAddItem("skills", skillInput, setSkillInput)
                            }
                            disabled={!skillInput.trim()}
                            className="h-11 px-3 bg-transparent"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {watchedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
                            {watchedSkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveItem("skills", skill)
                                  }
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

                {/* Responsibilities */}
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Key Responsibilities *
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={responsibilityInput}
                            onChange={(e) =>
                              setResponsibilityInput(e.target.value)
                            }
                            onKeyPress={(e) =>
                              handleKeyPress(
                                e,
                                "responsibilities",
                                responsibilityInput,
                                setResponsibilityInput
                              )
                            }
                            placeholder="Type a responsibility and press Enter"
                            className="h-11 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              handleAddItem(
                                "responsibilities",
                                responsibilityInput,
                                setResponsibilityInput
                              )
                            }
                            disabled={!responsibilityInput.trim()}
                            className="h-11 px-3 bg-transparent"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {watchedResponsibilities.length > 0 && (
                          <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                            {watchedResponsibilities.map(
                              (responsibility, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <span className="text-muted-foreground mt-0.5">
                                    •
                                  </span>
                                  <span className="flex-1">
                                    {responsibility}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveItem(
                                        "responsibilities",
                                        responsibility
                                      )
                                    }
                                    className="text-muted-foreground hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Benefits */}
                <FormField
                  control={form.control}
                  name="benefits"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Gift className="h-4 w-4" />
                        Benefits & Perks *
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={benefitInput}
                            onChange={(e) => setBenefitInput(e.target.value)}
                            onKeyPress={(e) =>
                              handleKeyPress(
                                e,
                                "benefits",
                                benefitInput,
                                setBenefitInput
                              )
                            }
                            placeholder="Type a benefit and press Enter"
                            className="h-11 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              handleAddItem(
                                "benefits",
                                benefitInput,
                                setBenefitInput
                              )
                            }
                            disabled={!benefitInput.trim()}
                            className="h-11 px-3 bg-transparent"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {watchedBenefits.length > 0 && (
                          <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                            {watchedBenefits.map((benefit, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className="text-muted-foreground mt-0.5">
                                  •
                                </span>
                                <span className="flex-1">{benefit}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveItem("benefits", benefit)
                                  }
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Requirements */}
                <FormField
                  control={form.control}
                  name="requirements"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Requirements *
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={requirementInput}
                            onChange={(e) =>
                              setRequirementInput(e.target.value)
                            }
                            onKeyPress={(e) =>
                              handleKeyPress(
                                e,
                                "requirements",
                                requirementInput,
                                setRequirementInput
                              )
                            }
                            placeholder="Type a requirement and press Enter"
                            className="h-11 flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              handleAddItem(
                                "requirements",
                                requirementInput,
                                setRequirementInput
                              )
                            }
                            disabled={!requirementInput.trim()}
                            className="h-11 px-3 bg-transparent"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {watchedRequirements.length > 0 && (
                          <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                            {watchedRequirements.map((requirement, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className="text-muted-foreground mt-0.5">
                                  •
                                </span>
                                <span className="flex-1">{requirement}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveItem(
                                      "requirements",
                                      requirement
                                    )
                                  }
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Job Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                          className="min-h-[150px] resize-none"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Provide a detailed description to attract the right
                        candidates
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="flex-1 h-12 bg-transparent"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 text-base font-medium"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Posting Job...
                      </>
                    ) : (
                      <>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Post Job
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="mt-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Tips for a great job posting:</strong>
              </p>
              <ul className="text-left space-y-1 max-w-md mx-auto">
                <li>• Use a clear, specific job title</li>
                <li>• List the most important skills first</li>
                <li>• Include salary range to attract quality candidates</li>
                <li>• Describe your company culture and benefits</li>
                <li>• Be specific about responsibilities and requirements</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
