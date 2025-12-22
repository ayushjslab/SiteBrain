import { Sidebar } from "@/components/shared/sidebar";
import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
        {children}
    </div>
  );
};

export default MainLayout;
