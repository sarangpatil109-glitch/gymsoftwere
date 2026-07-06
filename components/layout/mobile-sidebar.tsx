"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden text-foreground" />}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open sidebar</span>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-sidebar border-none">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Access the main navigation for GymOS.</SheetDescription>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
