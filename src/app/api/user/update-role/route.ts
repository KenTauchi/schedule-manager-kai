import { NextResponse } from "next/server";

import { updateUserRole } from "@/actions/user.actions";

export async function POST(req: Request) {
  const data = await req.json();

  const response = await updateUserRole(data);
  return NextResponse.json(response);
}
