function formatZodError(error) {
  const { fieldErrors, formErrors } = error.flatten();
console.log(error);
  // Collect all field-specific errors
  const messages = Object.values(fieldErrors).flat();

  // Add global form-level errors (if any)
  if (formErrors.length > 0) {
    messages.push(...formErrors);
  }

  // Return as a single readable string
  return messages.join(", ");
}

export default formatZodError;