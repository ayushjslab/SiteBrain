"use client";

import { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { AiOutlineSearch } from "react-icons/ai";

const workspaces = [
  { name: "Just", status: "free" },
  { name: "just-2", status: "free" },
  { name: "Another", status: "paid" },
];

export default function WorkspaceSelect() {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [query, setQuery] = useState("");

  const filteredWorkspaces =
    query === ""
      ? workspaces
      : workspaces.filter((ws) =>
          ws.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="w-72 relative">
      <Combobox value={selectedWorkspace} onChange={setSelectedWorkspace}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-gray-900 text-white text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
            <AiOutlineSearch className="absolute top-3 left-3 text-gray-400" />
            <Combobox.Input
              className="w-full py-2 pl-10 pr-3 bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
              displayValue={(workspace: any) => workspace?.name || ""}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Workspace..."
            />
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
              {filteredWorkspaces.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-400">
                  Nothing found.
                </div>
              ) : (
                filteredWorkspaces.map((workspace) => (
                  <Combobox.Option
                    key={workspace.name}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 flex justify-between ${
                        active ? "bg-gray-700" : ""
                      }`
                    }
                    value={workspace}
                  >
                    {workspace.name}
                    <span className="text-gray-400">{workspace.status}</span>
                  </Combobox.Option>
                ))
              )}
              <div className="border-t border-gray-700 mt-1">
                <button
                  className="w-full text-left py-2 px-4 text-blue-400 hover:bg-gray-700 rounded-b-md"
                  onClick={() => alert("Create Workspace clicked")}
                >
                  + Create Workspace
                </button>
              </div>
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
