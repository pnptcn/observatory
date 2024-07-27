import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from 'sonner';

export function Component() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

Component.displayName = "RootLayout";

