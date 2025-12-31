"use client";

import Navbar from "@/components/shared/navbar";
import { ReactNode } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { useSession } from "next-auth/react";
import Loading from "@/components/shared/loading";
import { usePathname, redirect } from "next/navigation";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") redirect("/login");

  const hideSidebar =
    pathname.includes("create-workspace") ||
    pathname.includes("create-new");

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar />
      </div>

      <div className="flex pt-16">
        {!hideSidebar && (
          <aside
            className="
              fixed
              top-16
              left-0
              h-[calc(100vh-4rem)]
              border-r
              bg-background
              z-40
            "
          >
            <Sidebar />
          </aside>
        )}

        {/* Main content */}
        <main
          className={`flex-1 overflow-y-auto`}
        >
          <div className="p-4 min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
