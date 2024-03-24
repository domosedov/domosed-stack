"use client";

import { ReactNode, useState } from "react";

export const Theme = ({ content }: { content: ReactNode }) => {
  const [theme, setTheme] = useState("light");

  return (
    <div
      className={
        theme === "light" ? "text-black bg-gray-100" : "text-white bg-gray-950"
      }
    >
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
      {content}
    </div>
  );
};
