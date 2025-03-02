"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUp, useSignUp } from "@clerk/nextjs";
import { syncUser } from "@/actions/user.actions";
import prisma from "@/lib/prisma";
import { createUser } from "@/actions/user.actions";
import { Form as FormProvider } from "@/components/ui/form";
import { NextResponse } from "next/server";
import FormInput from "@/components/Form/FormInput";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import FormSelectInput from "@/components/Form/FormSelectInput";

export default function SignupPage() {
  const { isLoaded, signUp } = useSignUp();
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.string().min(1, "Role is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  console.log(form.formState.errors);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("form data", data);
    try {
      const { email, password, name, role } = data;

      if (isLoaded) {
        const { client, response } = await signUp.create({
          emailAddress: email,
          password: password,
        });

        console.log("signup client", client);
        console.log("signup response", response);

        if (response.id) {
          try {
            const userData = await createUser({
              data: {
                clerkId: data.id,
                email: email,
                username: email.split("@")[0],
                name: name,
                role: role,
              },
            });

            console.log("db user data", userData);

            return NextResponse.json({
              data: userData,
            });
          } catch (error) {
            return NextResponse.json({ error: "failed to create user" }, { status: 500 });
          }
        }

        // Optionally redirect or show success message
      }
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  return (
    <div>
      Setup profile page
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4 max-w-[400px] mx-auto"
        >
          <FormInput name="name" label="Name" type="text" placeholder="Enter your name" />

          <FormInput name="email" label="Email" type="email" placeholder="Enter your email" />
          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <FormSelectInput
            name="role"
            label="Role"
            items={[
              { label: "Teacher", value: "teacher" },
              { label: "Student", value: "student" },
            ]}
            type="select"
            placeholder="Select your role"
          />
          <Button type="submit">Sign Up</Button>
        </form>
      </FormProvider>
    </div>
  );
}
