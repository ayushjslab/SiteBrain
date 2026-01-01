"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMoon, FiSun, FiPlus } from "react-icons/fi";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to the future of minimalist intelligence.",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: "I'm processing that with monochromatic precision.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div>
      <div className="transition-colors duration-500 font-sans ">
        <main className="max-w-3xl mx-auto pb-40 px-6">
          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`relative group max-w-[85%]`}>
                    <div
                      className={`
                      px-6 py-4 rounded-[2rem] text-sm md:text-base leading-relaxed
                      ${
                        msg.sender === "user"
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-2xl rounded-tr-none"
                          : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-tl-none"
                      }
                    `}
                    >
                      {msg.text}
                    </div>
                    <p
                      className={`text-[10px] mt-2 opacity-0 group-hover:opacity-40 transition-opacity uppercase tracking-widest ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.sender === "ai" ? "Synthesized" : "Delivered"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>

        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 w-full px-6 py-10 bg-linear-to-t from-neutral-50 via-neutral-50 to-transparent dark:from-[#050505] dark:via-[#050505] transition-colors"
        >
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>

            <div className="relative flex items-center bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 p-2 pl-6">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              />

              <button
                onClick={handleSend}
                className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <FiSend size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;
