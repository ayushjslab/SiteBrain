"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiOutlineSend } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";

const aiModels = [
  { label: "OpenAI GPT-4", value: "openai-gpt4" },
  { label: "OpenAI GPT-3.5", value: "openai-gpt3.5" },
  { label: "Google Gemini 1", value: "gemini-1" },
  { label: "Google Gemini 1.5", value: "gemini-1.5" },
];

export default function AIChatPage() {
  const [selectedModel, setSelectedModel] = useState(aiModels[0].value);
  const [temperature, setTemperature] = useState(0.7);
  const [instruction, setInstruction] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);

  const handleSend = () => {
    if (!instruction.trim()) return;
    setMessages([...messages, { role: "user", content: instruction }]);
    setInstruction("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "This is a mock AI response." },
      ]);
    }, 500);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Control Panel */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:w-1/3 p-8 flex flex-col gap-6 border-r"
      >
        <Button className="flex items-center gap-2 w-full  font-semibold rounded-xl transition transform hover:scale-105">
          <BsFillPersonFill /> Save to Agent
        </Button>

        <div>
          <label className="block mb-2 font-semibold">AI Model</label>
          <Select value={selectedModel} onValueChange={(val) => setSelectedModel(val)}>
            <SelectTrigger className="w-full ">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black rounded-lg">
              {aiModels.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Temperature: <span className="">{temperature}</span>
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full  cursor-pointer"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Instruction</label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={5}
            placeholder="Type your instruction..."
            className="w-full p-3 rounded-xl border  transition shadow-sm"
          />
        </div>
      </motion.div>

      {/* Right Chat Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col"
      >
        {/* Chat Messages */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl max-w-[70%] wrap-break-word shadow ${
                msg.role === "user"
                  ? "self-end bg-black text-white"
                  : "self-start bg-gray-100 text-black"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex p-6 gap-4 border-t border-gray-200">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-2xl px-5 py-3 border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black shadow-sm transition"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            className="px-5 py-3 flex items-center gap-2 bg-black text-white rounded-2xl hover:bg-gray-800 transition transform hover:scale-105"
          >
            <AiOutlineSend /> Send
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
