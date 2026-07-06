import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex max-w-md flex-col items-center justify-center rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <SearchX className="h-10 w-10 text-primary" />
        </div>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">404</h2>
        <p className="mb-6 text-base text-muted-foreground">
          Oops! The page you are looking for does not exist.
        </p>
        <Button render={<Link href="/dashboard" />} className="gap-2">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
