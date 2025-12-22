"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log(theme)

  if (!mounted) return null;
  return (
    <div className="light:bg-white">
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        click
      </button>
    </div>
  );
}
