"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { RouterProvider } from "react-aria-components";

export const ReactAriaRouterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  return <RouterProvider navigate={router.push}>{children}</RouterProvider>;
};
