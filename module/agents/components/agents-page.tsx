"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useFetchAgents } from "../hooks/useFetchAgents";
export interface Agent {
  id: string;
  name: string;
  image: string;
  updatedAt: Date;
}

export default function AgentsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: agents, isLoading: agentsLoading } =
    useFetchAgents(workspaceId);
  console.log(agents);
  if (agentsLoading) {
    return <p className="flex items-center justify-center">Loading...</p>;
  }
  return (
    <div className="min-h-full px-6 py-8">
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
        {agents.map((agent: Agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </motion.div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const router = useRouter();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() =>
        router.push(`/dashboard/${workspaceId}/agents/${agent.id}`)
      }
      className="group relative overflow-hidden rounded-2xl border bg-background
                 shadow-sm hover:shadow-lg cursor-pointer"
    >
      {/* Soft glow */}
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={agent.image}
          alt={agent.name}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/agent-placeholder.png";
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-4">
        <h3 className="text-lg font-semibold">{agent.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Updated {timeAgo(new Date(agent.updatedAt))}
        </p>
      </div>
    </motion.div>
  );
}


function timeAgo(date: Date) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diff = Date.now() - date.getTime();

  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60_000, "second"],
    [3_600_000, "minute"],
    [86_400_000, "hour"],
    [604_800_000, "day"],
    [2_592_000_000, "week"],
    [31_536_000_000, "month"],
    [Infinity, "year"],
  ];

  for (let i = 0; i < units.length; i++) {
    if (diff < units[i][0]) {
      const value = Math.round(
        diff / (i === 0 ? 1_000 : units[i - 1][0])
      );
      return rtf.format(-value, units[i][1]);
    }
  }
}
