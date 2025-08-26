"use client";

import {
  AlertTriangle,
  RefreshCw,
  Home,
  ArrowLeft,
  Wifi,
  Server,
  Shield,
  Clock,
  FileX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const errorConfigs = {
  404: {
    icon: FileX,
    title: "Page Not Found",
    message: "The page you are looking for does not exist or has been moved.",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    suggestions: [
      "Check the URL for typos",
      "Use the navigation menu to find what you need",
      "Go back to the previous page",
      "Visit our homepage",
    ],
  },
  500: {
    icon: Server,
    title: "Server Error",
    message: "Something went wrong on our end. Our team has been notified.",
    color: "text-red-600",
    bgColor: "bg-red-100",
    suggestions: [
      "Try refreshing the page",
      "Wait a few minutes and try again",
      "Contact support if the problem persists",
      "Check our status page for updates",
    ],
  },
  403: {
    icon: Shield,
    title: "Access Forbidden",
    message: "You do not have permission to access this resource.",
    color: "text-red-600",
    bgColor: "bg-red-100",
    suggestions: [
      "Make sure you are logged in",
      "Check if you have the required permissions",
      "Contact your administrator",
      "Try logging out and back in",
    ],
  },
  401: {
    icon: Shield,
    title: "Authentication Required",
    message: "You need to be logged in to access this page.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    suggestions: [
      "Log in to your account",
      "Check if your session has expired",
      "Reset your password if needed",
      "Contact support for help",
    ],
  },
  network: {
    icon: Wifi,
    title: "Connection Problem",
    message:
      "Unable to connect to our servers. Please check your internet connection.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    suggestions: [
      "Check your internet connection",
      "Try refreshing the page",
      "Disable VPN if you are using one",
      "Try again in a few minutes",
    ],
  },
  timeout: {
    icon: Clock,
    title: "Request Timeout",
    message: "The request took too long to complete. Please try again.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    suggestions: [
      "Try again with a stable connection",
      "Reduce the amount of data being processed",
      "Contact support if this continues",
      "Check your internet speed",
    ],
  },
  validation: {
    icon: AlertTriangle,
    title: "Validation Error",
    message: "There was a problem with the information provided.",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    suggestions: [
      "Check all required fields",
      "Ensure data formats are correct",
      "Try submitting again",
      "Contact support if needed",
    ],
  },
  generic: {
    icon: AlertTriangle,
    title: "Something Went Wrong",
    message: "An unexpected error occurred. Please try again.",
    color: "text-foreground",
    bgColor: "bg-background",
    suggestions: [
      "Try refreshing the page",
      "Clear your browser cache",
      "Try again later",
      "Contact support if the problem persists",
    ],
  },
};

export function UniversalError({
  type = "generic",
  title,
  message,
  errorCode,
  onRetry,
  onBack,
  onHome,
  showRetry = true,
  showBack = true,
  showHome = true,
  retryText = "Try Again",
  className = "",
  children,
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const config = errorConfigs[type];
  const IconComponent = config.icon;

  const handleRetry = async () => {
    if (!onRetry) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div
      className={`min-h-screen bg-background flex items-center justify-center p-4 ${className}`}
    >
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${config.bgColor} mb-6`}
          >
            <IconComponent className={`w-10 h-10 ${config.color}`} />
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-primary mb-2">
            {title || config.title}
          </h1>

          {/* Error Code */}
          {(errorCode || type !== "generic") && (
            <div className="text-sm text-foreground mb-4">
              Error Code: {errorCode || type.toUpperCase()}
            </div>
          )}

          {/* Error Message */}
          <p className="text-lg text-foreground mb-6 leading-relaxed">
            {message || config.message}
          </p>

          {/* Custom Children */}
          {children && <div className="mb-6">{children}</div>}

          {/* Suggestions */}
          <div className="rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-3">
              What you can try:
            </h3>
            <ul className="space-y-2">
              {config.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {showRetry && onRetry && (
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                className="min-w-[120px]"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {retryText}
                  </>
                )}
              </Button>
            )}

            {showBack && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            )}

            {showHome && (
              <Button variant="outline" onClick={handleHome}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Specialized Error Components
export function NotFoundError(props) {
  return <UniversalError type="404" {...props} />;
}

export function ServerError(props) {
  return <UniversalError type="500" {...props} />;
}

export function ForbiddenError(props) {
  return <UniversalError type="403" {...props} />;
}

export function UnauthorizedError(props) {
  return <UniversalError type="401" {...props} />;
}

export function NetworkError(props) {
  return <UniversalError type="network" {...props} />;
}

export function TimeoutError(props) {
  return <UniversalError type="timeout" {...props} />;
}

export function ValidationError(props) {
  return <UniversalError type="validation" {...props} />;
}
