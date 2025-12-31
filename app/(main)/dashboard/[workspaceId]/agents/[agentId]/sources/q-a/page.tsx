"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Plus, MessageSquare, Clock, ArrowLeft, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FAQItem {
  id: string
  question: string
  answer: string
  createdAt: string
}

export default function FAQManager() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [faqs, setFaqs] = useState<FAQItem[]>([])

  const handleAdd = () => {
    if (!question.trim() || !answer.trim()) return

    const newFaq: FAQItem = {
      id: crypto.randomUUID(),
      question: question.trim(),
      answer: answer.trim(),
      createdAt: new Date().toLocaleString(),
    }

    setFaqs([newFaq, ...faqs])
    setQuestion("")
    setAnswer("")
  }

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id))
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-8 border-border">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Q&A Trained</h1>
            <p className="text-muted-foreground">Manage your questions and answers systematically.</p>
          </div>
        </header>

        {/* Input Section */}
        <section className="grid md:grid-cols-[1fr,1.5fr] gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> New Question
            </h2>
            <div className="space-y-4">
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
                <Plus className="h-5 w-5" /> Add Q&A Pair
              </Button>
            </div>
          </div>

          <div className="bg-card/30 rounded-2xl border border-border/50 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border/50 bg-card/50">
              <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Preview</h2>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-center text-center">
              {question || answer ? (
                <div className="space-y-4 text-left">
                  <p className="text-xl font-medium text-foreground">Q: {question || "..."}</p>
                  <p className="text-muted-foreground leading-relaxed italic">A: {answer || "..."}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">Start typing to see a preview of your entry.</p>
              )}
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="space-y-6 pt-12 border-t border-border">
          <div className="flex justify-between items-end">
            <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Recent History</h2>
            <span className="text-xs text-muted-foreground font-mono bg-accent/50 px-2 py-1 rounded">
              {faqs.length} Entries
            </span>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="w-[40%] px-6">Question</TableHead>
                  <TableHead className="w-[40%] px-6">Answer</TableHead>
                  <TableHead className="px-6 text-right">Added At</TableHead>
                  <TableHead className="w-12.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {faqs.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="h-48 text-center text-muted-foreground italic">
                        No Q&A pairs added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    faqs.map((faq) => (
                      <motion.tr
                        key={faq.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        className="group border-border/50 hover:bg-muted/10 transition-colors"
                      >
                        <TableCell className="px-6 py-4 font-medium text-foreground align-top">
                          <div className="line-clamp-2">{faq.question}</div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-muted-foreground align-top">
                          <div className="line-clamp-2">{faq.answer}</div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right text-xs font-mono text-muted-foreground/60 align-top">
                          <div className="flex items-center justify-end gap-1">
                            <Clock className="h-3 w-3" /> {faq.createdAt.split(",")[1]}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 align-top">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(faq.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  )
}
