"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Send, Bot, User, Save, Sliders } from 'lucide-react';

const AgentInterface = () => {
  const [temp, setTemp] = useState(0.7);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI agent. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "I've received your instructions and I'm processing the request based on the current settings." }]);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white flex flex-col md:flex-row font-sans transition-colors duration-300">
      
      {/* LEFT SECTION: SETTINGS */}
      <motion.section 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-87.5 border-b md:border-b-0 md:border-r border-gray-200 dark:border-zinc-800 p-6 flex flex-col gap-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5" />
          <h2 className="text-xl font-bold tracking-tight">Agent Settings</h2>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium uppercase tracking-wider text-gray-500">AI Model</label>
          <select className="w-full bg-transparent border border-gray-200 dark:border-zinc-800 rounded-md p-2 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-all">
            <option>GPT-4o (Omni)</option>
            <option>Claude 3.5 Sonnet</option>
            <option>Llama 3.1 70B</option>
          </select>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <label className="text-sm font-medium uppercase tracking-wider text-gray-500">System Instructions</label>
          <textarea 
            placeholder="e.g. You are a helpful creative assistant..."
            className="w-full h-32 bg-transparent border border-gray-200 dark:border-zinc-800 rounded-md p-3 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none resize-none transition-all"
          />
        </div>

        {/* Temperature Range */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Temperature
            </label>
            <span className="font-mono text-sm">{temp}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={temp} 
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="w-full accent-black dark:accent-white cursor-pointer"
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-auto w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-md font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </motion.button>
      </motion.section>

      {/* RIGHT SECTION: CHAT */}
      <section className="flex-1 flex flex-col h-150 md:h-screen relative bg-gray-50/50 dark:bg-zinc-950/30">
        
        {/* Chat Header */}
        <header className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-black">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="font-semibold tracking-tight">Active Session</span>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 dark:border-zinc-800 shrink-0 ${msg.role === 'user' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-transparent'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-linear-to-t from-white dark:from-black to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message your agent..."
              className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full py-4 pl-6 pr-14 focus:ring-1 focus:ring-black dark:focus:ring-white outline-none shadow-xl transition-all"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-2 p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center mt-4 text-gray-400 uppercase tracking-widest">
            Agent responses may vary based on temperature settings.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AgentInterface;