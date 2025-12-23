"use client";

import {
  BarChart3,
  Users,
  Settings,
  CreditCard,
  ChartSpline,
  ChartBarDecreasing,
  FolderOpenDot,
  Rocket,
  Settings2,
  MessageSquareText,
  MessagesSquare,
  Tags,
  Smile,
  FileText,
  Type,
  Globe,
  HelpCircle,
  Plug,
  Code2,
  Share2,
  LifeBuoy,
  SlidersHorizontal,
  Brain,
  ShieldCheck,
  Palette,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { SidebarItemDropdown } from "./sidebard-item-dropdown";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SiStreamrunners } from "react-icons/si";
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import { IconType } from "react-icons/lib";
import { MdContactPhone } from "react-icons/md";
import { RiNotionFill } from "react-icons/ri";


const navItems = [
  {
    label: "Activity",
    Icon: ChartSpline,
    navigations: [
      {
        label: "Chat logs",
        url: "/dashboard/123/agents/123/activity",
        Icon: MessageSquareText,
      },
      {
        label: "Leads",
        url: "/",
        Icon: Users,
        soon: true,
      },
    ],
  },
  {
    label: "Analytics",
    Icon: ChartBarDecreasing,
    navigations: [
      { label: "Chats", url: "/", Icon: MessagesSquare },
      { label: "Topics", url: "/", Icon: Tags },
      { label: "Sentiment", url: "/", Icon: Smile },
    ],
  },
  {
    label: "Sources",
    Icon: FolderOpenDot,
    navigations: [
      { label: "Files", url: "/", Icon: FileText },
      { label: "Text", url: "/", Icon: Type },
      { label: "Website", url: "/", Icon: Globe },
      { label: "Q&A", url: "/", Icon: HelpCircle },
      { label: "Notion", url: "/", Icon: RiNotionFill, soon: true },
    ],
  },
  {
    label: "Actions",
    Icon: SiStreamrunners,
    navigations: [
      { label: "Available Actions", url: "/", Icon: Plug },
      { label: "Integrations", url: "/", Icon: Plug },
    ],
  },
];
const lastNavItems = [
  {
    label: "Deploy",
    url: "/",
    Icon: Rocket,
    navigations: [
      { label: "Embed", url: "/", Icon: Code2 },
      { label: "Share", url: "/", Icon: Share2 },
      { label: "Help page", url: "/", Icon: LifeBuoy, soon: true },
    ],
  },
  {
    label: "Settings",
    url: "/",
    Icon: Settings2,
    navigations: [
      { label: "General", url: "/", Icon: SlidersHorizontal },
      { label: "AI", url: "/", Icon: Brain },
      { label: "Chat interface", url: "/", Icon: Palette },
      { label: "Security", url: "/", Icon: ShieldCheck },
    ],
  },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const {workspaceId} = useParams<{ workspaceId: string }>()
  const pathName = usePathname();
  const isAgentPage = /^\/dashboard\/[^/]+\/agents\/[^/]+(\/.*)?$/.test(
    pathName
  );


  const workspaceSettings = [
  {
    label: "General",
    url: `/dashboard/${workspaceId}/settings/general`,
    Icon: SlidersHorizontal,
  },
  {
    label: "Members",
    url: `/dashboard/${workspaceId}/settings/members`,
    Icon: Users,
  },
  {
    label: "Billing",
    url: `/dashboard/${workspaceId}/settings/billing`,
    Icon: CreditCard,
  },
  {
    label: "Plans",
    url: `/dashboard/${workspaceId}/settings/plans`,
    Icon: Layers,
  },
];

  return (
    <aside
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`relative flex h-[calc(100vh-5rem)] overflow-hidden overflow-y-auto flex-col border-r bg-background transition-all duration-300 ease-in-out
        ${open ? "w-64" : "w-16"}`}
    >
      {isAgentPage ? (
        <nav className="flex flex-col gap-1 px-2 py-4">
          <SidebarItem
            open={open}
            icon={SiGoogledisplayandvideo360}
            label="Playground"
            url="/dashboard/123/agents/123/playground"
          />
          {navItems.map((nav, index) => (
            <SidebarItemDropdown
              key={index}
              label={nav.label}
              Icon={nav.Icon}
              navigations={nav.navigations}
              open={open}
            />
          ))}

          <SidebarItem
            open={open}
            icon={MdContactPhone}
            label="Contacts"
            soon={true}
            url="/dashboard/123/agents/123/contacts"
          />

          {lastNavItems.map((nav, index) => (
            <SidebarItemDropdown
              key={index}
              label={nav.label}
              Icon={nav.Icon}
              navigations={nav.navigations}
              open={open}
            />
          ))}
        </nav>
      ) : (
        <nav className="flex flex-col gap-1 px-2 py-4">
          <SidebarItem
            open={open}
            icon={Users}
            label="Agents"
            url={`/dashboard${workspaceId}/agents`}
          />

          <SidebarItem
            open={open}
            icon={BarChart3}
            label="Usage"
            url={`/dashboard${workspaceId}/usage`}
          />

          <SidebarItemDropdown
            label="Workspace Settings"
            Icon={Settings}
            navigations={workspaceSettings}
            open={open}
          />
        </nav>
      )}

      {!isAgentPage && (
        <>
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
        </>
      )}
    </aside>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  open,
  url,
  soon,
}: {
  icon: LucideIcon | IconType;
  label: string;
  open: boolean;
  url: string;
  soon?: boolean;
}) {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(url)}
      className={`relative flex items-center gap-3 rounded-lg px-3 pr-12 py-2 transition-colors cursor-pointer
    ${
      pathName.includes(label.toLowerCase())
        ? "bg-gray-300 text-black dark:text-background"
        : "text-black dark:text-white hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black"
    }`}
    >
      <Icon className="h-4 w-4 shrink-0 ml-1" />

      <span
        className={`flex flex-1 items-center overflow-hidden whitespace-nowrap transition-all duration-300
      ${open ? "opacity-100 max-w-50" : "opacity-0 max-w-0"}`}
      >
        <span className="truncate">{label}</span>
      </span>

      {soon && open && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-yellow-500 px-1.5 py-0.5 text-[9px] font-semibold text-black">
          SOON
        </span>
      )}
    </button>
  );
}
