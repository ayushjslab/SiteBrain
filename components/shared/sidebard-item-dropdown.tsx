import { useState } from "react";
import { ChevronRight, LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";

interface INavs {
  label: string;
  url: string;
  Icon?: LucideIcon | IconType;
  soon?: boolean;
}

export function SidebarItemDropdown({
  label,
  Icon,
  navigations,
  open: isSidebarOpen,
}: {
  label: string;
  Icon: LucideIcon | IconType;
  navigations: INavs[];
  open: boolean;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className="w-full text-sm">
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center cursor-pointer justify-between rounded-md px-3 py-2 text-foreground  dark:hover:text-black ${
          open
            ? "dark:hover:bg-white/30 dark:hover:text-white hover:bg-gray-200"
            : "dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white"
        }`}
      >
        <div className="flex items-center gap-2 font-medium">
          <Icon className="h-4 w-4 ml-1" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300
              ${isSidebarOpen ? "max-w-50 opacity-100" : "max-w-0 opacity-0"}`}
          >
            {label}
          </span>
        </div>

        <ChevronRight
          className={`h-4 w-4 transition-transform ${
            isSidebarOpen ? "opacity-100" : "opacity-0 -translate-x-2"
          } ${open ? "rotate-90" : ""}`}
        />
      </button>

      {isSidebarOpen && open && (
        <div className="relative mt-1 ml-3">
          <div className="absolute left-2 top-0 h-full w-px bg-border" />

          <div className="flex flex-col gap-0.5 pl-6">
            {navigations.map((nav) => (
              <button
                key={nav.label}
                onClick={() => {
                  if (!nav.soon) router.push(nav.url);
                }}
                disabled={nav.soon}
                className={`relative rounded-md flex items-center gap-2 px-3 py-2 text-left transition cursor-pointer w-fit ${
                  nav.soon
                    ? "opacity-60 cursor-not-allowed"
                    : pathName.includes(nav.label.toLowerCase())
                    ? "bg-gray-300 dark:text-black"
                    : "hover:dark:text-black hover:bg-gray-100 hover:text-foreground"
                }`}
              >
                {nav.Icon && <nav.Icon className="h-3 w-3" />}
                <span>{nav.label}</span>

                {/* SOON TAG */}
                {nav.soon && (
                  <span className="absolute top-2.5 -right-16 rounded-full bg-yellow-500 px-1.5 py-0.5 text-[9px] font-semibold text-black">
                    SOON
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
