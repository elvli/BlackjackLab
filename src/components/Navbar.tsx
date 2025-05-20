import Link from "next/link";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

import { SidebarTrigger } from "@/components/ui/sidebar";

async function Navbar() {
  const user = await currentUser();
  if (user) await syncUser(); // POST

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="w-full">
        <div className="relative h-16 flex items-center justify-center ml-4 mr-6 px-4">
          <div className="absolute left-0 flex items-center h-full">
            <SidebarTrigger />
          </div>

          <Link
            href="/"
            className="text-xl font-bold text-primary tracking-wider"
          >
            BLACKJACK LAB
          </Link>

          <div className="absolute right-0 flex items-center h-full gap-4">
            <DesktopNavbar />
            <MobileNavbar />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
