"use client";

import { usePathname } from "next/navigation";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./mobile-sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/members": "Members",
  "/attendance": "Attendance",
  "/payments": "Payments",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  // Format current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const title = pageTitles[pathname] || "GymOS";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <MobileSidebar />
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="hidden sm:block text-sm font-medium text-muted-foreground">
            {currentDate}
          </div>
          
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
