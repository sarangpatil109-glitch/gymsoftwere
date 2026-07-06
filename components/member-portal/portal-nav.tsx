"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Dumbbell,
  Apple,
  LineChart,
  MoreHorizontal,
  User,
  CreditCard,
  CalendarCheck,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface PortalNavProps {
  memberId: string;
}

export function PortalNav({ memberId }: PortalNavProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainNav = [
    { name: "Home", href: `/member/${memberId}`, icon: Home, exact: true },
    { name: "Workout", href: `/member/${memberId}/workout`, icon: Dumbbell, exact: false },
    { name: "Diet", href: `/member/${memberId}/diet`, icon: Apple, exact: false },
    { name: "Progress", href: `/member/${memberId}/progress`, icon: LineChart, exact: false },
  ];

  const moreNav = [
    { name: "Profile", href: `/member/${memberId}/profile`, icon: User },
    { name: "Payments", href: `/member/${memberId}/payments`, icon: CreditCard },
    { name: "Attendance", href: `/member/${memberId}/attendance`, icon: CalendarCheck },
  ];

  const isMoreActive = moreNav.some(item => pathname.includes(item.href));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 fixed inset-y-0 left-0 z-50">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <Link href={`/member/${memberId}`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900 dark:text-blue-100">GymOS</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto py-6 px-4">
          <nav className="flex-1 space-y-2">
            {[...mainNav, ...moreNav].map((item: any) => {
              const isActive = item.exact ? pathname === item.href : pathname.includes(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/member/login"
              onClick={() => localStorage.removeItem("member_session")}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="flex items-center justify-around h-16">
          {mainNav.map((item: any) => {
            const isActive = item.exact ? pathname === item.href : pathname.includes(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                )}
              >
                <item.icon className={cn("h-6 w-6", isActive ? "fill-blue-100 dark:fill-blue-900/20" : "")} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <SheetTrigger render={
              <button className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isMoreActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
              )}>
                <MoreHorizontal className="h-6 w-6" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            } />
            <SheetContent side="bottom" className="rounded-t-2xl p-0">
              <div className="px-4 py-6 space-y-1 bg-white dark:bg-slate-950 rounded-t-2xl">
                {moreNav.map((item) => {
                  const isActive = pathname.includes(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl transition-colors",
                        isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                      )}
                    >
                      <div className={cn("p-2 rounded-full", isActive ? "bg-blue-100 dark:bg-blue-900/50" : "bg-slate-100 dark:bg-slate-800")}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-base">{item.name}</span>
                    </Link>
                  );
                })}
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
                <Link
                  href="/member/login"
                  onClick={() => {
                    localStorage.removeItem("member_session");
                    setIsMoreOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-base">Sign Out</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
