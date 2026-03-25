"use client";

import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { getProfilePath } from "@/lib/profile-path";

function DesktopNavbar() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="hidden md:flex items-center space-x-4">
        <ModeToggle />
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      {user ? (
        <>
          <Button variant="ghost" asChild>
            <Link href="/sessions">Sessions</Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={getProfilePath({
                username: user.username,
                emailAddress: user.emailAddresses[0]?.emailAddress,
              })}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}
export default DesktopNavbar;
