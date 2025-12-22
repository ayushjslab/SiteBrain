"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const agents = [
  {
    id: 1,
    name: "Nova Assistant",
    updatedAt: "2 hours ago",
    image: "https://botscrew.com/wp-content/uploads/2024/10/What-Are-Generative-AI-Agents-and-Why-Top-Companies-Implement-Them_-3-1.jpg",
  },
  {
    id: 2,
    name: "Atlas AI",
    updatedAt: "Yesterday",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROHG3zuZ-ikjD8uHAjK_E-jdJihNpJprRAkg&s",
  },
  {
    id: 3,
    name: "Echo Brain",
    updatedAt: "3 days ago",
    image: "https://cdn.analyticsvidhya.com/wp-content/uploads/2025/01/Self-RAG-Teaching-Language-Models-to-Critically-Evaluate-Their-Own-Output.webp",
  },
]


export default function AgentsPage() {
  return (
    <div className="min-h-full px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Your Agents
        </h1>
        <p className="mt-1 text-muted-foreground">
          Intelligent agents you’ve created and trained
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </motion.div>
    </div>
  )
}


function AgentCard({ agent }: { agent: any }) {
    const router = useRouter();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      whileHover={{ y: -6 }}
      onClick={() => router.push("/dashboard/123/agents/123")}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border bg-background shadow-sm
                 hover:shadow-xl transition-shadow cursor-pointer"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -inset-24 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
      </div>

      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={agent.image}
          alt={agent.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative space-y-1 p-4">
        <h3 className="text-lg font-semibold text-foreground">
          {agent.name}
        </h3>

        <p className="text-sm text-muted-foreground">
          Last updated {agent.updatedAt}
        </p>
      </div>
    </motion.div>
  )
}
