"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingPlans() {
  const [dark, setDark] = useState(true);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-full">
      <div className=" bg-white text-black dark:bg-black dark:text-white transition-colors duration-500 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-8"
          >
            {/* FREE PLAN */}
            <motion.div variants={item}>
              <Card className="rounded-2xl border border-black/20 dark:border-white/20 bg-transparent backdrop-blur">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-2">Free</h2>
                  <p className="text-sm opacity-70 mb-6">A smooth start</p>

                  <ul className="space-y-3 text-sm">
                    <li>• 1 workspace</li>
                    <li>• 2 AI agents / workspace</li>
                    <li>• 5MB data per agent</li>
                    <li>• 5 actions</li>
                  </ul>

                  <div className="mt-8">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-black dark:border-white"
                    >
                      Get started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* PRO PLAN */}
            <motion.div variants={item}>
              <Card className="rounded-2xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-xl">
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-semibold">Pro</h2>
                    <span className="text-sm font-medium opacity-80">$19 / mo</span>
                  </div>
                  <p className="text-sm opacity-80 mb-6">Unleash everything</p>

                  <ul className="space-y-3 text-sm">
                    <li>• 5 workspaces</li>
                    <li>• 3 AI agents / workspace</li>
                    <li>• 10MB data per agent</li>
                    <li>• 10 actions</li>
                  </ul>

                  <div className="mt-8">
                    <Button className="w-full rounded-xl bg-white text-black dark:bg-black dark:text-white">
                      Go Pro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
