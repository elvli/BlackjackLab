"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

import { syncUser } from "@/actions/user.action";

function UserSync() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      return;
    }

    if (syncedUserIdRef.current === userId) {
      return;
    }

    syncedUserIdRef.current = userId;
    void syncUser();
  }, [isLoaded, isSignedIn, userId]);

  return null;
}

export default UserSync;
