import { Loader2 } from "lucide-react";

export function UniversalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm gap-2 p-2">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-muted-foreground font-medium">Loading...</span>
    </div>
  );
}