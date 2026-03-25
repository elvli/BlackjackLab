"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function syncUser() {
  try {
    const { userId } = await auth()
    const user = await currentUser();

    if (!userId || !user) return;

    const email = user.emailAddresses[0]?.emailAddress;
    const preferredUsername =
      user.username ?? email?.split("@")[0] ?? userId;

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      return prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email: email ?? existingUser.email,
          username: preferredUsername,
          image: user.imageUrl,
        },
      });
    }

    if (!email) {
      throw new Error("Authenticated user is missing an email address");
    }

    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      return prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          clerkId: userId,
          username: preferredUsername,
          image: user.imageUrl,
        },
      });
    }

    let username = preferredUsername;
    let suffix = 1;

    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${preferredUsername}-${suffix}`;
      suffix += 1;
    }

    return prisma.user.create({
      data: {
        clerkId: userId,
        email,
        username,
        image: user.imageUrl,
      },
    });

  } catch (error) {
    console.log("Error in syncUser", error)
  }

}
