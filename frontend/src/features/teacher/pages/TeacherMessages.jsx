import React from "react";
import { Outlet } from "react-router-dom";

export default function TeacherMessages() {
  return (
    <div className="h-[calc(100vh-120px)] w-full">
      <Outlet />
    </div>
  );
}
