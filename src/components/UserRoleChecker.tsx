import React from "react";
import { useUser } from "@clerk/nextjs"; // Assuming you're using Clerk for authentication
import { useQuery } from "react-query"; // Assuming you're using react-query for data fetching
import { fetchUserRole } from "@/actions/user.actions"; // Function to fetch user role

const UserRoleChecker: React.FC = () => {
  const { user } = useUser(); // Fetch the user data

  if (!user) {
    return <div>Please log in.</div>;
  }

  // Fetch user role based on user ID
  const {
    data: role,
    isLoading,
    error,
  } = useQuery(["userRole", user.id], () => fetchUserRole(user.id));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user role.</div>;

  return (
    <div>
      {role === "STUDENT" && <h1>Welcome, Student!</h1>}
      {role === "TEACHER" && <h1>Welcome, Teacher!</h1>}
      {role === "PENDING" && <h1>Your account is pending approval.</h1>}
      {role !== "STUDENT" && role !== "TEACHER" && role !== "PENDING" && <h1>Welcome, User!</h1>}
    </div>
  );
};

export default UserRoleChecker;
