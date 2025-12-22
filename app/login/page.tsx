"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { HiHome } from "react-icons/hi";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { useTheme } from "next-themes";
import Image from "next/image";
import { redirect } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import Loading from "@/components/shared/loading";
export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

   const { status } = useSession();
  
    if (status === "loading") {
      return <Loading />;
    }
  
    if (status === "authenticated") {
      redirect("/create-workspace");
    }

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogin () {
    try {
      await signIn("google", {callbackUrl: "/"})
    } catch (error) {
      console.log(error)
      toast.error("Failed to login")
    }
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-8 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer text-black dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 p-1 rounded-md"
            onClick={() => redirect("/")}
          >
            <HiHome size={22} />
          </motion.div>

          <div className="flex items-center gap-2 text-black dark:text-white font-semibold">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "linear",
              }}
            >
              <Image
                src={theme === "light" ? "/dark-icon.png" : "/light-icon.png"}
                width={35}
                height={35}
                alt="icon"
              />
            </motion.div>

            <span className="text-lg font-semibold tracking-[0.2em] uppercase text-black dark:text-white transition-all duration-300 hover:tracking-[0.35em]">
              SiteBrain
            </span>
          </div>

          <motion.button
            whileTap={{ rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-black dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-white/20 p-1.5 rounded-md"
          >
            {theme === "dark" ? (
              <BsSunFill size={18} />
            ) : (
              <BsMoonStarsFill size={18} />
            )}
          </motion.button>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-semibold text-black dark:text-white text-center"
        >
          Welcome Back
        </motion.h1>

        <p className="mt-2 text-center text-sm text-black/60 dark:text-white/60">
          Sign in to continue
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handleLogin}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-black/20 dark:border-white/20 bg-white dark:bg-black px-4 py-3 text-sm font-medium text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </motion.button>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/20 dark:bg-white/20" />
          <span className="text-xs text-black/50 dark:text-white/50">
            SECURE SIGN IN
          </span>
          <div className="h-px flex-1 bg-black/20 dark:bg-white/20" />
        </div>

        <p className="mt-6 text-center text-xs text-black/60 dark:text-white/40">
          By continuing, you agree to our{" "}
          <span className="hover:underline cursor-pointer dark:text-white text-black">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="hover:underline cursor-pointer dark:text-white text-black">
            Privacy Policy
          </span>
        </p>
      </motion.div>
    </div>
  );
}
