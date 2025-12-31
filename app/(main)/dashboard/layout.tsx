import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="ml-15">
        {children}
    </div>
  );
};

export default MainLayout;
