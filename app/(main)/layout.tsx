"use client";

import Navbar from "@/components/shared/navbar";
import { ReactNode } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { useSession } from "next-auth/react";
import Loading from "@/components/shared/loading";
import { redirect, usePathname } from "next/navigation";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();
  const pathName = usePathname();

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {!pathName.includes("create-workspace") && !pathName.includes("plans") && <Sidebar />}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
