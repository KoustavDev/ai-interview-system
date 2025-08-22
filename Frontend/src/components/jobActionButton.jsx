import React from "react";
import { Button } from "./ui/button";
import { Play } from "lucide-react";

const JobActionButton = ({
  handleStartInterview,
  isStartingInterview,
  status,
}) => {
  let actionText = {
    action: "Apply now",
    loading: "Appling ...",
  };
  if (status === "pending") {
    actionText.action = "Start Interview";
    actionText.loading = "Starting Interview...";
  } else if (status === "interviewed") actionText.action = "Interviewed";
  else if (status === "shortlisted") actionText.action = "You are sortlisted";
  else if (status === "rejected") actionText.action = "You are rejected";

  return (
    <Button
      size="lg"
      onClick={handleStartInterview}
      disabled={
        isStartingInterview ||
        status === "rejected" ||
        status === "shortlisted" ||
        status === "interviewed"
      }
      className="cursor-pointer w-full lg:w-auto min-w-[200px] h-14 text-lg font-semibold shadow-lg"
    >
      {isStartingInterview ? (
        <>
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
          {actionText.loading}
        </>
      ) : (
        <>
          <Play className="mr-2 h-5 w-5" />
          {actionText.action}
        </>
      )}
    </Button>
  );
};

export default JobActionButton;
