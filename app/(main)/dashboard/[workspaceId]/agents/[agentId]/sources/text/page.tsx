"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Plus, Type, Clock, Hash, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

interface SavedText {
  id: string
  title: string
  content: string
  wordCount: number
  createdAt: string
}

export default function TextManager() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([])

  const wordCount = useMemo(() => {
    return content.trim() === "" ? 0 : content.trim().split(/\s+/).length
  }, [content])

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return

    const newEntry: SavedText = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      wordCount,
      createdAt: new Date().toLocaleString(),
    }

    setSavedTexts([newEntry, ...savedTexts])
    setTitle("")
    setContent("")
  }

  const handleDelete = (id: string) => {
    setSavedTexts(savedTexts.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-8 border-border">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Trained By Text</h1>
            <p className="text-muted-foreground">Minimalist text management and analysis.</p>
          </div>
        </header>

        {/* Editor Section */}
        <section className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Give your text title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-medium border-none focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto"
            />
            <div className="relative group">
              <Textarea
                placeholder="Start writing here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-75 overflow-y-auto text-lg leading-relaxed border-none focus-visible:ring-0 resize-none placeholder:text-muted-foreground/50"
              />
              <div className="absolute bottom-2 right-4 flex items-center gap-4 text-xs font-mono text-muted-foreground/60 transition-opacity">
                <span className="flex items-center gap-1">
                  <Hash className="h-3 w-3" /> {wordCount} words
                </span>
                <span className="flex items-center gap-1">
                  <Type className="h-3 w-3" /> {content.length} chars
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="w-full md:w-auto px-8 py-6 text-base rounded-full gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" /> Save Entry
          </Button>
        </section>

        {/* History Table */}
        <section className="space-y-6 pt-12 border-t border-border">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Recent Entries</h2>
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {savedTexts.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-muted-foreground italic"
                >
                  No saved drafts yet. Start writing above.
                </motion.p>
              ) : (
                savedTexts.map((text) => (
                  <motion.div
                    key={text.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Card className="group border-border/50 hover:border-border transition-colors bg-card/50">
                      <CardContent className="p-5 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate text-foreground">{text.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-mono">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {text.createdAt}
                            </span>
                            <span className="flex items-center gap-1">
                              <Hash className="h-3 w-3" /> {text.wordCount} words
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(text.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
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
  )
}
