import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { createUser } from "@/actions/user.actions";
import { Form as FormProvider } from "@/components/ui/form";
import { NextResponse } from "next/server";
import FormInput from "@/components/Form/FormInput";
import { Button } from "@/components/ui/button";
import { useUpdateUserRole } from "@/hooks/user/useUpdateRole";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import FormSelectInput from "@/components/Form/FormSelectInput";
import { currentUser } from "@clerk/nextjs/server";
import RoleUpdateForm from "./form";

export default async function SignupPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center">Hi {user?.firstName}! Let's set up your account.</h1>
      <RoleUpdateForm id={user.id} />
    </div>
  );
}
