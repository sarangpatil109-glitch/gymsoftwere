"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex max-w-md flex-col items-center justify-center rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          An unexpected error has occurred. Our system has logged this issue.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => reset()} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
