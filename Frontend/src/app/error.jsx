"use client";

import { UniversalError } from "@/components/error-state/universal-error";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Global error:", error.message);
  }, [error]);

  // Determine error type based on error message
  let errorType = "generic";

  if (error.message.includes("fetch") || error.message.includes("network")) {
    errorType = "network";
  } else if (error.message.includes("timeout")) {
    errorType = "timeout";
  }
  else if (error.message.includes("authorized")) {
    errorType = "403";
  } else if (
    error.message.includes("500") ||
    error.message.includes("server")
  ) {
    errorType = "500";
  }

  return (
    <UniversalError
      type={errorType}
      message={error.message}
      details={error.stack}
      errorCode={error.digest}
      timestamp={new Date().toLocaleString()}
      onRetry={reset}
      showRetry={true}
      showBack={true}
      showHome={true}
    />
  );
}
