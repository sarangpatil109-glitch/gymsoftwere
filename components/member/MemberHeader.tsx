import { Bell } from "lucide-react";
import Link from "next/link";

interface MemberHeaderProps {
  memberId: string;
  name: string;
  daysRemaining: number;
}

export function MemberHeader({ memberId, name, daysRemaining }: MemberHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center overflow-hidden border border-blue-200 dark:border-blue-800">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberId}`} alt="Avatar" className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">Hi, {name}</h2>
          <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
            {daysRemaining} Days Remaining
          </p>
        </div>
      </div>
      
      <button className="relative h-9 w-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-950"></span>
      </button>
    </header>
  );
}
