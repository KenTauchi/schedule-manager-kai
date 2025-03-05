import { useUser } from "@clerk/nextjs";
import { useState } from "react";

type UpdateOnboardingProp = {
  id: string;
};
export function useUpdateUserOnboarding() {
  const [isLoading, setIsLoading] = useState(false);

  const updateUserOnboarding = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/update-onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userData = await response.json();
      return { success: true, data: userData };
    } catch (error) {
      throw new Error("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserOnboarding, isLoading };
}
