"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RiSparkling2Fill } from "react-icons/ri";
import { HiChevronDown } from "react-icons/hi";
import { HiOutlineDocumentText } from "react-icons/hi2";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import ProfilePopover from "./profile-popover";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import DropDownSearch from "./drop-down-search";
import { useSession } from "next-auth/react";
import { useAllWorkspaces } from "@/module/workspace/hooks/useAllWorkspaces";
import { useCurrentWorkspace } from "@/module/workspace/hooks/useCurrentWorkspace";
import { useEffect, useState } from "react";
interface Workspace {
  id: string;
  name: string;
  plan?: string;
}
export default function Navbar() {
  const pathName = usePathname();
  const { theme } = useTheme();
  const router = useRouter();
  const { data: session } = useSession();

  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)

  const { data: workspaces, isLoading } = useAllWorkspaces(session?.user?.id);
   const { workspaceId } = useParams<{ workspaceId: string }>();
  
  const { data } = useCurrentWorkspace(workspaceId);
  
    useEffect(() => {
      if (data) {
        setCurrentWorkspace(data);
      }
    }, [data]);

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-19.75 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-black dark:text-white font-semibold cursor-pointer"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "linear",
              }}
            >
              <Image
                src={theme === "light" ? "/dark-icon.png" : "/light-icon.png"}
                width={35}
                height={35}
                alt="icon"
              />
            </motion.div>

            <span className="text-lg font-semibold tracking-[0.2em] uppercase text-black dark:text-white transition-all duration-300 hover:tracking-[0.35em]">
              SiteBrain
            </span>
          </div>
          {pathName.includes("dashboard") && (
            <div className="hidden md:flex items-center gap-2">
              <DropDownSearch
                things={workspaces ?? []}
                thingName={
                  isLoading ? "Loading workspaces…" : "Create Workspace"
                }
                current={currentWorkspace}
              />
              /
              <DropDownSearch
                things={[
                  { id: "1", name: "Just", plan: "free" },
                  { id: "2", name: "just-2", plan: "free" },
                ]}
                thingName="Create Agent"
                current={currentWorkspace}
              />
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Docs */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/docs"
            className="flex items-center gap-2 rounded-xl border border-black/20 dark:border-white/20 px-4 py-2 text-sm text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            <HiOutlineDocumentText />
            Docs
          </motion.a>

          {/* Profile */}
          <ProfilePopover />
        </div>
      </div>
    </nav>
  );
}

function NavDropdown({ label }: { label: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          {label}
          <HiChevronDown className="opacity-60" />
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-44 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-2 shadow-xl"
      >
        <DropdownItem label={`All ${label}s`} />
        <DropdownItem label={`Create ${label}`} />
        <DropdownItem label="Settings" />
      </PopoverContent>
    </Popover>
  );
}

function DropdownItem({ label }: { label: string }) {
  return (
    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition">
      {label}
    </button>
  );
}
