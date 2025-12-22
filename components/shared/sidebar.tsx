"use client";

import { BarChart3, Users, Settings, CreditCard } from "lucide-react";
import { useState } from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { SidebarItemDropdown } from "./sidebard-item-dropdown";
import { redirect, usePathname, useRouter } from "next/navigation";

const workspaceSettings = [
  { label: "General", url: "/dashboard/123/settings/general" },
  { label: "Members", url: "/dashboard/123/settings/members" },
  { label: "Billing", url: "/dashboard/123/settings/billing" },
  { label: "Plans", url: "/dashboard/123/settings/plans" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <aside
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`relative flex flex-col border-r bg-background overflow-hidden transition-all duration-300 ease-in-out
        ${open ? "w-64" : "w-16"}`}
    >
      <nav className="flex flex-col gap-1 px-2 py-4">
        <SidebarItem
          open={open}
          icon={Users}
          label="Agents"
          url="/dashboard/123/agents"
        />

        <SidebarItem
          open={open}
          icon={BarChart3}
          label="Usage"
          url="/dashboard/123/usage"
        />

        <SidebarItemDropdown
          label="Workspace Settings"
          Icon={Settings}
          navigations={workspaceSettings}
          open={open}
        />
      </nav>

      <div className="flex-1" />

      <div className="border-t px-3 py-4">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />

          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300
        ${open ? "max-w-60 opacity-100" : "max-w-0 opacity-0"}`}
          >
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">free Plan</div>

              <div className="text-sm">
                <span className="text-lg font-semibold text-foreground">
                  48
                </span>
                <span className="text-muted-foreground"> / 50 credits</span>
              </div>

              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[96%] rounded-full bg-blue-500" />
              </div>

              <button className="text-sm text-blue-500 hover:underline">
                View plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  open,
  active,
  url,
}: {
  icon: LucideIcon;
  label: string;
  open: boolean;
  active?: boolean;
  url: string;
}) {
    const pathName = usePathname();
    const router = useRouter();
  return (
    <button
      onClick={() => router.push(url)}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer
        ${
          pathName.includes(label.toLowerCase())
            ? "bg-gray-300 text-black dark:text-background"
            : "text-black dark:text-white hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black"
        }`}
    >
      <Icon className="h-4 w-4 shrink-0 ml-1" />

      <span
        className={`flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap transition-all duration-300
          ${open ? "opacity-100 max-w-50" : "opacity-0 max-w-0"}`}
      >
        <span className="truncate">{label}</span>
      </span>
    </button>
  );
}
