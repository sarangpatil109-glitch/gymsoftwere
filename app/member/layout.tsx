import { ReactNode } from "react";

export default function MemberPortalRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-200 selection:text-blue-900">
      {children}
    </div>
  );
}
