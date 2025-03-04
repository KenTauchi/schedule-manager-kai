import Image from "next/image";
import { currentUser, auth } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.actions";

export default async function Home() {
  const user = await syncUser();
  const { userId } = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
          {!userId ? (
            <h2 className="text-red-500">Not Authenticated</h2>
          ) : (
            <h2 className="text-green-500">Authenticated</h2>
          )}
          <p className="text-lg font-semibold">Welcome to the schedule manager KAI.</p>
          <p className="text-md">Are you a teacher? Manage your class schedule and students!</p>
          <p className="text-md">Are you a student? Manage your course and schedule!</p>
        </div>
      </div>
    </main>
  );
}
