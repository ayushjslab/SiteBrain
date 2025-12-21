"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { HiArrowLeft, HiHome } from "react-icons/hi";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center px-6"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[7rem] font-bold tracking-tight text-black dark:text-white"
        >
          404
        </motion.h1>

        <p className="mt-2 text-lg text-black/70 dark:text-white/70 max-w-md">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="my-8 h-px w-24 bg-black/20 dark:bg-white/20" />

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-xl border border-black/20 dark:border-white/20 px-5 py-3 text-sm font-medium text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            <HiArrowLeft size={18} />
            Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-xl bg-black dark:bg-white px-5 py-3 text-sm font-medium text-white dark:text-black transition-all"
          >
            <HiHome size={18} />
            Home
          </motion.button>
        </div>

        <p className="mt-10 text-xs tracking-wide uppercase text-black/50 dark:text-white/50">
          Lost, but not broken
        </p>
      </motion.div>
    </div>
  );
}
