"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useCreateAgent } from "@/module/agents/hooks/useCreateAgent";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateAgentPage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [persona, setPersona] = useState("support");
  const { mutateAsync: createAgent, isPending } = useCreateAgent();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const router = useRouter();
  const handleCreate = async () => {
    const res = await createAgent({
      workspaceId,
      name,
      image,
      persona,
    });
    if (res.ok) {
      toast.success("Agent created successfully");
      router.push(`/dashboard/${workspaceId}/agents/${res?.agent?.id}`);
    } else {
      toast.error(res.message);
    }
    setName("");
    setImage("");
    setPersona("support");
  };

  return (
    <div className=" flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="shadow-2xl p-6 max-w-lg w-full space-y-6"
      >
        <h1 className="text-3xl font-bold text-center">Create New Agent</h1>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block mb-1 font-medium">Agent Name</label>
          <Input
            placeholder="Enter agent name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="block mb-1 font-medium">Profile Icon URL</label>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            {image ? (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mt-2"
              >
                <img
                  src={image}
                  alt="Preview"
                  className="w-18 h-18 rounded-full border border-gray-300 shadow-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/icon";
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mt-2"
              >
                <div className="w-18 h-18 rounded-full border border-gray-300 shadow-lg object-cover" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Persona Select */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block mb-1 font-medium">Persona</label>
          <Select value={persona} onValueChange={setPersona}>
            <SelectTrigger>
              <SelectValue placeholder="Select a persona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="assistant">Assistant</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex justify-end space-x-3 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            onClick={() => {
              setName("");
              setImage("");
              setPersona("support");
            }}
          >
            Cancel
          </Button>
          <button onClick={handleCreate} disabled={isPending}>
            {isPending ? "Creating..." : "Create Agent"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
