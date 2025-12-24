import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentWorkspace } from "@/module/workspace/hooks/useCurrentWorkspace";

interface Workspace {
  id: string;
  name: string;
  plan?: string;
}

const DropDownSearch = ({
  things,
  thingName,
  current
}: {
  things: Workspace[];
  thingName: string;
  current: Workspace | null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    current
  );
 
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const filteredWorkspaces = things.filter((thing) =>
    thing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectWorkspace = (thing: Workspace) => {
    setSelectedWorkspace(thing);
    setIsOpen(false);
    router.push(`/dashboard/${thing.id}/agents`);
    setSearchQuery("");
  };

  const handleCreateWorkspace = () => {
    setIsOpen(false);
    router.push("/create-workspace");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-w-22 items-center justify-between rounded-md bg-background px-3 py-1 text-sm transition dark:hover:bg-white/10 cursor-pointer"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium text-foreground">
            {selectedWorkspace === null ? (
              <span className="dark:text-gray-400">Select</span>
            ) : (
              selectedWorkspace?.name
            )}
          </span>
          {selectedWorkspace !== null && (
            <span className="text-sm text-muted-foreground border px-2 py-0.5 rounded-full">
              {selectedWorkspace?.plan}
            </span>
          )}
        </div>

        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-full z-50 mt-1 w-64 -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md bg-muted pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none dark:bg-white/10 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto py-1">
            {filteredWorkspaces.length ? (
              filteredWorkspaces.map((thing) => (
                <button
                  key={thing.id}
                  onClick={() => handleSelectWorkspace(thing)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm transition dark:hover:bg-white/20  hover:bg-gray-200 cursor-pointer ${
                    selectedWorkspace?.id === thing.id
                      ? "bg-gray-100 dark:bg-white/10"
                      : ""
                  }`}
                >
                  <span className="font-medium text-foreground">
                    {thing.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {thing.plan}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                No things found
              </div>
            )}
          </div>

          {/* Create */}
          <div className="border-t border-border">
            <button
              onClick={handleCreateWorkspace}
              className="flex w-full items-center gap-2 px-3 py-3 cursor-pointer text-sm transition dark:hover:bg-white/10 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{thingName}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownSearch;
