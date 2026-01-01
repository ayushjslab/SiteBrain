"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  MessageSquare,
  Clock,
  Hash,
  MemoryStick,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateChunks } from "@/module/sources/hooks/useCreateChunks";
import { useParams } from "next/navigation";
import { useFetchSource } from "@/module/sources/hooks/useFetchSource";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/formate-date";
import { useDeleteChunks } from "@/module/sources/hooks/useDeleteChunks";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export default function FAQManager() {
  const [question, setQuestion] = useState("");
  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const { mutate, data, isPending, error } = useCreateChunks();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { agentId } = useParams<{ agentId: string }>();

  const { data: sourceData, isLoading } = useFetchSource({
    workspaceId,
    agentId,
    type: "qa",
  });
  const handleAdd = () => {
    if (!question.trim() || !answer.trim()) return;

    const qaText = `Q: ${question.trim()}\nA: ${answer.trim()}`;

    mutate({
      text: qaText,
      type: "qa",
      workspaceId,
      agentId,
      title,
    });
    setQuestion("");
    setAnswer("");
    setTitle("");
  };

  const { mutate: deletionMutate, isPending: deletionLoading } =
      useDeleteChunks();
  
    const handleDelete = (id: string) => {
      deletionMutate({ sourceId: id });
    };

  console.log(data);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl ml-10 md:mx-auto space-y-12">
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-8 border-border">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Q&A Trained
            </h1>
            <p className="text-muted-foreground">
              Manage your questions and answers systematically.
            </p>
          </div>
        </header>

        <section className="grid md:grid-cols-[1fr,1.5fr] gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> New Question
            </h2>
            <div className="space-y-4">
              <Input
                placeholder="Title for this Q&A"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg border-none bg-card/50 focus-visible:ring-1 focus-visible:ring-border px-4 py-6"
              />
              <Input
                placeholder="What is the question?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="text-lg border-none bg-card/50 focus-visible:ring-1 focus-visible:ring-border px-4 py-6"
              />
              <Textarea
                placeholder="Provide a detailed answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-37.5 text-base border-none bg-card/50 focus-visible:ring-1 focus-visible:ring-border px-4 py-4 resize-none"
              />
              <Button
                onClick={handleAdd}
                disabled={!question.trim() || !answer.trim()}
                className="w-full py-6 text-base rounded-xl gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isPending ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Add Q&A Pair
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-12 border-t border-border">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Recent Entries
          </h2>
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {sourceData?.sources?.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-muted-foreground italic"
                >
                  No saved drafts yet. Start writing above.
                </motion.p>
              ) : (
                sourceData?.sources?.map((text) => (
                  <motion.div
                    key={text._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Card className="group border-border/50 hover:border-border transition-colors bg-card/50">
                      <CardContent className="p-5 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate text-foreground">
                            {text.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-mono">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />{" "}
                              {formatDate(text.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="h-3 w-3" /> {text.words} words
                            </span>
                            <span className="flex items-center gap-1">
                              <MemoryStick className="h-3 w-3" />{" "}
                              {(text.size / 1024).toPrecision(3)}KB size
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(text._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                        >
                          {deletionLoading ? (
                            <Loader2Icon className="animate-spin h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete</span>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
