"use server";
import { currentUser, auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function createUser(data: any) {
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId: data.id,
        email: data.email,
        username: data.username ?? data.email.split("@")[0],
        name: data.name,
        role: data.role,
      },
    });

    return { success: true, data: newUser };
  } catch (error) {
    console.error("Error creating user", error);
  }
}
export async function syncUser() {
  try {
    const user = await currentUser();
    const { userId } = await auth();

    if (!user || !userId) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        name: `${user.firstName} ${user.lastName}`,
        image: user.imageUrl,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error syncing user", error);
  }
}
