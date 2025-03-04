import { useUser } from "@clerk/nextjs";
import { useState } from "react";

type UpdateRoleProp = {
  id: string;
  role: "STUDENT" | "TEACHER";
};
export function useUpdateUserRole() {
  const [isLoading, setIsLoading] = useState(false);

  const updateUserRole = async ({ id, role }: UpdateRoleProp) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, role }),
      });
      const userData = await response.json();
      return { success: true, data: userData };
    } catch (error) {
      throw new Error("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserRole, isLoading };
}
