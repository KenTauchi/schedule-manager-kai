import Image from "next/image";
import { currentUser, auth } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.actions";

export default async function Home() {
  const user = await syncUser();
  const { userId } = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          {!userId ? "Not Authenticated" : "Authenticated"}
        </div>
      </div>
    </main>
  );
}
