"use client"

import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
  })

  const handleError = useCallback((error, type) => {
    const errorObj = typeof error === "string" ? new Error(error) : error

    // Determine error type if not provided
    let errorType = type
    if (!errorType) {
      if (errorObj.message.includes("404") || errorObj.message.includes("not found")) {
        errorType = "404"
      } else if (errorObj.message.includes("403") || errorObj.message.includes("forbidden")) {
        errorType = "403"
      } else if (errorObj.message.includes("401") || errorObj.message.includes("unauthorized")) {
        errorType = "401"
      } else if (errorObj.message.includes("500") || errorObj.message.includes("server")) {
        errorType = "500"
      } else if (errorObj.message.includes("network") || errorObj.message.includes("fetch")) {
        errorType = "network"
      } else if (errorObj.message.includes("timeout")) {
        errorType = "timeout"
      } else {
        errorType = "generic"
      }
    }

    setErrorState({
      hasError: true,
      error: errorObj,
      errorType,
      message: errorObj.message,
      details: errorObj.stack,
    })

    // Show toast notification for non-critical errors
    if (errorType !== "404" && errorType !== "403" && errorType !== "401") {
      toast({
        title: "Error",
        description: errorObj.message,
        variant: "destructive",
      })
    }

    // Log error for monitoring
    console.error("Error handled:", errorObj, { type: errorType })
  }, [])

  const clearError = useCallback(() => {
    setErrorState({ hasError: false })
  }, [])

  const retry = useCallback(
    async (retryFn) => {
      clearError()
      if (retryFn) {
        try {
          await retryFn()
        } catch (error) {
          handleError(error)
        }
      }
    },
    [clearError, handleError],
  )

  return {
    errorState,
    handleError,
    clearError,
    retry,
    hasError: errorState.hasError,
  }
}

// Hook for async operations with error handling
export function useAsyncError() {
  const { handleError } = useErrorHandler()

  const executeAsync = useCallback(
    async (asyncFn) => {
      try {
        return await asyncFn()
      } catch (error) {
        handleError(error, errorType)
        return null
      }
    },
    [handleError],
  )

  return { executeAsync }
}
