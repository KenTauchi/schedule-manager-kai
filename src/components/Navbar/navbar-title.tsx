"use client";
import React, { use } from "react";
import { usePathname } from "next/navigation";

export const NavbarTitle = () => {
  const pathName = usePathname();

  let title;

  switch (pathName) {
    case "/":
      title = "Home";
      break;
    case "/student-dashboard":
      title = "Student Dashboard";
      break;
    case "/teacher-dashboard":
      title = "Teacher Dashboard";
      break;
    default:
      title = "Hi! ";
      break;
  }

  return <h1 className="text-lg font-bold">{title}</h1>;
};
