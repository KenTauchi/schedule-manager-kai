"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form as FormProvider } from "@/components/ui/form";
import { NextResponse } from "next/server";
import { Button } from "@/components/ui/button";
import { useUpdateUserRole } from "@/hooks/user/useUpdateRole";
import FormSelectInput from "@/components/Form/FormSelectInput";
import { completeOnBoardingForClerk } from "@/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useUpdateUserOnboarding } from "@/hooks/user/useUpdateOnboarding";

export default function RoleUpdateForm({ id }: { id: string }) {
  const { updateUserRole } = useUpdateUserRole();

  const { user } = useUser();
  const router = useRouter();

  const formSchema = z.object({
    role: z.enum(["STUDENT", "TEACHER"], {
      required_error: "Role is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    const { role } = data;

    try {
      const [resUserRole, clerkResponse] = await Promise.all([
        updateUserRole({ id, role }),
        completeOnBoardingForClerk(role),
      ]);

      if (resUserRole?.success && clerkResponse?.success) {
        router.push(role === "STUDENT" ? "student-dashboard" : "teacher-dashboard");
        return NextResponse.json({ message: "Role updated successfully" }, { status: 200 });
      }

      if (!resUserRole?.success || !clerkResponse?.success) {
        return NextResponse.json(
          { error: "failed to update clerk public metadata" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error("Failed to update role");
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-6 max-w-[400px] mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <FormSelectInput
          name="role"
          label="Role"
          items={[
            { label: "Teacher", value: "TEACHER" },
            { label: "Student", value: "STUDENT" },
          ]}
          type="select"
          placeholder="Select your role"
          className="border border-gray-300 rounded-md p-2"
        />
        <Button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Setting up..." : "Setup role"}
        </Button>
      </form>
    </FormProvider>
  );
}
