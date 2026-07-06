"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Apple, LineChart, User } from "lucide-react";

export function BottomNavigation({ slug }: { slug: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: `/member/${slug}`, icon: Home },
    { name: "Workout", href: `/member/${slug}/workout`, icon: Dumbbell },
    { name: "Diet", href: `/member/${slug}/diet`, icon: Apple },
    { name: "Progress", href: `/member/${slug}/progress`, icon: LineChart },
    { name: "Profile", href: `/member/${slug}/profile`, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-around px-2 h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all duration-300 ${isActive ? "bg-blue-50 dark:bg-blue-900/30 scale-110" : "scale-100"}`}>
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
              </div>
              <span className={`text-[10px] font-medium transition-all ${isActive ? "opacity-100" : "opacity-70"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
