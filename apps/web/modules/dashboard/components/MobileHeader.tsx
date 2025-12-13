"use client";

import Link from "next/link";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { ModeToggle } from "@/components/theme-toggle";

export const MobileHeader = () => {
  return (
    <header className="flex md:hidden items-center justify-between border-b border-border bg-background px-4 py-3">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold">Loco</span>
        </Link>
      </div>
      <ModeToggle />
    </header>
  );
};
