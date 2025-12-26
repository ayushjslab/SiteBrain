import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentWorkspace } from "@/module/workspace/hooks/useCurrentWorkspace";

interface Agent {
  id: string;
  name: string;
  plan?: string;
}

const DropDownSearchAgent = ({
  agents,
  agentName,
}: {
  agents: Agent[];
  agentName: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Agent | null>(
    null
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const filteredWorkspaces = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleSelectWorkspace = (agent: Agent) => {
    setSelectedWorkspace(agent);
    setIsOpen(false);
    router.push(`/dashboard/${agent.id}/agents`);
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
              filteredWorkspaces.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleSelectWorkspace(agent)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm transition dark:hover:bg-white/20  hover:bg-gray-200 cursor-pointer ${
                    selectedWorkspace?.id === agent.id
                      ? "bg-gray-100 dark:bg-white/10"
                      : ""
                  }`}
                >
                  <span className="font-medium text-foreground">
                    {agent.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {agent.plan}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                No agents found
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
              <span className="font-medium text-foreground">{agentName}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownSearchAgent;
