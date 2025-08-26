'use client'

import { NotFoundError } from "@/components/error-state/universal-error";

export default function NotFound() {
  return (
    <NotFoundError
      title="Page Not Found"
      message="The page you are looking for does not exist or has been moved."
      onRetry={() => window.location.reload()}
      showRetry={false}
    />
  );
}
