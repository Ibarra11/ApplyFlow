import { Loader2 } from "lucide-react";

import { useParsedResume } from "@/lib/api/queries/use-parsed-resume";
import { ResumeUpload } from "./resume-upload";
import { ResumeView } from "./resume-view";

export function ResumeManager() {
  const { data: stored, isLoading } = useParsedResume();

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-6 animate-spin stroke-neutral-900" />
      </div>
    );
  }

  if (!stored?.resume) {
    return <ResumeUpload />;
  }

  return <ResumeView stored={stored} />;
}
