import { Construction } from "lucide-react";

export function ComingSoon({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 border border-dashed rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 animate-in fade-in duration-500">
      <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Construction className="h-10 w-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md">{description}</p>
      <div className="mt-8">
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-200">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
