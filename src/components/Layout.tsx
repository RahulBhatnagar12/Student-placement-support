import { ReactNode } from "react";
import BurgerMenu from "./BurgerMenu";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <BurgerMenu />
      <main className="pl-0 md:pl-4">{children}</main>
    </div>
  );
};

export default Layout;
