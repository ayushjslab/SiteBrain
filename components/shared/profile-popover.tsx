"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineSupport,
  HiOutlineLogout,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function ProfilePopover() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-10 cursor-pointer w-10 overflow-hidden rounded-full border border-black/20 dark:border-white/20"
        >
          <Image
            src={theme === "light" ? "/dark-icon.png" : "/light-icon.png"}
            width={35}
            height={35}
            alt="icon"
          />
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-56 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-2 shadow-xl"
      >
        <div className="space-y-1">
          <MenuItem
            icon={<HiOutlineViewGrid className="text-lg" />}
            label="Dashboard"
          />

          <MenuItem
            icon={<HiOutlineUser className="text-lg" />}
            label="Account Settings"
          />

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <BsSunFill className="text-lg" />
              ) : (
                <BsMoonStarsFill className="text-lg" />
              )}
              <span>Appearance</span>
            </div>
            <span className="text-xs opacity-60">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>

          <MenuItem
            icon={<HiOutlineSupport className="text-lg" />}
            label="Support"
          />

          <div className="my-1 h-px bg-black/10 dark:bg-white/10" />

          <MenuItem
            icon={<HiOutlineLogout className="text-lg" />}
            label="Logout"
            danger
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MenuItem({
  icon,
  label,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition cursor-pointer
        ${
          danger
            ? "text-red-500 hover:bg-red-500/10"
            : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
