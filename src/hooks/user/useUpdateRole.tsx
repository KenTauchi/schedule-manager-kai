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

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error updating role:", response.status, errorData);
        return {
          success: false,
          error: errorData?.error || `Error ${response.status}: ${response.statusText}`,
        };
      }

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
