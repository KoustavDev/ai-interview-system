"use client";

import { seStartInterview } from "@/api/queryMutations";
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

