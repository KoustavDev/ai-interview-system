"use client";

import { UniversalError } from "@/components/error-state/universal-error";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <UniversalError
          type="500"
          title="Application Error"
          message="A critical error occurred in the application."
          errorCode={error.digest}
          onRetry={reset}
          showRetry={true}
          showBack={false}
          showHome={true}
          showContact={true}
        />
      </body>
    </html>
  );
}
