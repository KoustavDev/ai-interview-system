"use client";

import { useDeleteInterview, useStartInterview } from "@/api/queryMutations";
import { AIInterviewPage } from "@/components/ai-interview-page";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";

export default function AIInterviewPageDemo({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { mutateAsync: startInterview, isPending } = useStartInterview();

  const [jobTitle, setJobTitle] = useState("");
  const [interviewId, setInterviewId] = useState("");
  const [initialData, setInitialData] = useState(null);
  let tabSwitchingCount = 0;

  useEffect(() => {
    async function start() {
      const { data, success } = await startInterview(id);

      if (success) {
        setJobTitle(data?.jobTitle || "");
        setInterviewId(data?.interview?.id || "");
        setInitialData({
          id: data?.messageRecord?.id,
          content: data?.messageRecord?.message,
          sender: data?.messageRecord?.sender || "ai",
          timestamp: data?.messageRecord?.timestamp,
        });
      } else {
        router.back();
      }
    }

    start();
  }, [id, router, startInterview]);

  // useEffect(() => {
  //   document.addEventListener("visibilitychange", () => {
  //     if (document.hidden) {
  //       tabSwitchingCount++;
  //       alert(` Tab switcheed ${tabSwitchingCount} times`);
  //     }
  //   });

  //   return () => {
  //     document.removeEventListener("visibilitychange");
  //   };
  // }, []);

  return (
    <div className="min-h-screen bg-background">
      {isPending || !initialData ? (
        <Loader />
      ) : (
        <AIInterviewPage
          jobTitle={jobTitle}
          interviewId={interviewId}
          initialData={initialData}
        />
      )}
    </div>
  );
}

let a = {
  messageRecord: {
    id: "d9dd1e77-3a99-47c3-9da9-01a36b8f23f3",
    interviewId: "ae812ce9-0cf5-4e75-b78e-166b46bc48fb",
    sender: "ai",
    message:
      "Hello and welcome to the interview process for the Junior Backend Developer position. Could you please introduce yourself?",
    timestamp: "2025-08-20T18:14:23.607Z",
  },
  interview: {
    id: "ae812ce9-0cf5-4e75-b78e-166b46bc48fb",
    applicationId: "e64035de-3335-4528-bf5d-e5dad268e4c2",
    startedAt: "2025-08-20T18:14:13.637Z",
    completedAt: null,
  },
  jobTitle: "Junior Backend Developer",
  isFinished: false,
};
