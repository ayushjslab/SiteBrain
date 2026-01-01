"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Type,
  Clock,
  Hash,
  MemoryStick,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateChunks } from "@/module/sources/hooks/useCreateChunks";
import { useParams } from "next/navigation";
import { useFetchSource } from "@/module/sources/hooks/useFetchSource";
import { formatDate } from "@/lib/formate-date";
import { useDeleteChunks } from "@/module/sources/hooks/useDeleteChunks";

interface SavedText {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string;
}

export default function TextManager() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const wordCount = useMemo(() => {
    return content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
  }, [content]);
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { agentId } = useParams<{ agentId: string }>();

  const { mutate, isPending } = useCreateChunks();

  const { data: sourceData, isLoading } = useFetchSource({
    workspaceId,
    agentId,
    type: "text",
  });

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    mutate({
      text: content,
      type: "text",
      workspaceId,
      agentId,
      title,
      words: wordCount,
    });

    setTitle("");
    setContent("");
  };

  const { mutate: deletionMutate, isPending: deletionLoading } =
    useDeleteChunks();

  const handleDelete = (id: string) => {
    deletionMutate({ sourceId: id });
  };

  const sizeInBytes = new TextEncoder().encode(content).length;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Container: Max-width 4xl is ideal for reading/writing focus */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:px-8 space-y-12">
        {/* Header Section */}
        <header className="space-y-2 border-l-4 border-primary pl-6 py-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Trained By Text
          </h1>
          <p className="text-muted-foreground text-lg">
            Minimalist text management and analysis.
          </p>
        </header>

        {/* Input Section: Glass-like Card */}
        <section className="relative overflow-hidden rounded-3xl border bg-card/30 p-1 backdrop-blur-sm shadow-xl shadow-foreground/5">
          <div className="bg-background rounded-[22px] p-4 md:p-6 space-y-4">
            <Input
              placeholder="Give your text title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold border-none focus-visible:ring-0 placeholder:text-muted-foreground/30 h-auto p-0 px-2"
            />

            <div className="relative">
              <Textarea
                placeholder="Start writing your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-75 text-lg leading-relaxed border-none focus-visible:ring-0 resize-none placeholder:text-muted-foreground/30 p-2"
              />

              {/* Floating Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/50 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80">
                <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                  <Hash className="h-3.5 w-3.5" /> {wordCount} Words
                </span>
                <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                  <Type className="h-3.5 w-3.5" /> {content.length} Chars
                </span>
                <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                  <MemoryStick className="h-3.5 w-3.5" />{" "}
                  {(sizeInBytes / 1024).toFixed(2)} KB
                </span>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || isPending}
              className="w-full h-14 text-lg font-semibold rounded-2xl gap-3 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              {isPending ? (
                <Loader2Icon className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <Plus className="h-5 w-5" /> Save Entry
                </>
              )}
            </Button>
          </div>
        </section>

        {/* History Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-2">
              <span className="w-8 h-px bg-muted-foreground/30"></span>
              Recent Entries
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <AnimatePresence mode="popLayout">
              {sourceData?.sources?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 border-2 border-dashed rounded-3xl text-muted-foreground"
                >
                  <p className="italic">
                    No saved drafts yet. Start writing above.
                  </p>
                </motion.div>
              ) : (
                sourceData?.sources?.map((text) => (
                  <motion.div
                    key={text._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="group relative border-border/40 bg-card/40 hover:bg-card hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
                      <CardContent className="p-6 flex items-center justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {text.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground/80 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-primary/60" />
                              {formatDate(text.createdAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Hash className="h-3.5 w-3.5 text-primary/60" />
                              {text.words} words
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(text._id)}
                          className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          {deletionLoading ? (
                            <Loader2Icon className="animate-spin h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
