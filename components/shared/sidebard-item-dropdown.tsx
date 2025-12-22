import { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface INavs {
  label: string;
  url: string;
}

export function SidebarItemDropdown({
  label,
  Icon,
  navigations,
  open: isSidebarOpen,
}: {
  label: string;
  Icon: LucideIcon;
  navigations: INavs[];
  open: boolean;
}) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  return (
    <div className="w-full text-sm">
      {/* Header */}
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
              ${
                isSidebarOpen
                  ? "max-w-50 opacity-100"
                  : "max-w-0 opacity-0"
              }`}
          >
            {label}
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isSidebarOpen ? "opacity-100" : "opacity-0 -translate-x-2"
          } ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Content */}
      {isSidebarOpen && open && (
        <div className="relative mt-1 ml-3">
          {/* Vertical line */}
          <div className="absolute left-2 top-0 h-full w-px bg-border" />

          <div className="flex flex-col gap-0.5 pl-6">
            {navigations.map((nav) => (
              <button
                key={nav.label}
                onClick={() => router.push(nav.url)}
                className="rounded-md px-3 py-2 text-left text-muted-foreground  hover:dark:text-black hover:bg-gray-100 hover:text-foreground transition cursor-pointer w-fit"
              >
                {nav.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
