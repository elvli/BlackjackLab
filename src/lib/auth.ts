import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function requireClerkUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function ensureCurrentUserRecord() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: user.emailAddresses[0]?.emailAddress ?? `${user.id}@example.com`,
      username:
        user.username ??
        user.emailAddresses[0]?.emailAddress.split("@")[0] ??
        user.id,
      image: user.imageUrl,
    },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? `${user.id}@example.com`,
      username:
        user.username ??
        user.emailAddresses[0]?.emailAddress.split("@")[0] ??
        user.id,
      image: user.imageUrl,
    },
  });
}
