"use server";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { connectDB } from "@/lib/connectDB";
import Source from "@/models/source";

type ContentType = "qa" | "text";

interface ChunkWithEmbedding {
  id: string;
  text: string;
  embedding: number[];
  workspaceId: string;
  agentId: string;
  sourceId: string;
}

export async function createChunksWithEmbedding({
  rawText,
  type,
  workspaceId,
  agentId,
  title,
  words,
}: {
  rawText: string;
  type: ContentType;
  workspaceId: string;
  agentId: string;
  title?: string;
  words?: number;
}): Promise<ChunkWithEmbedding[]> {
  if (!rawText.trim()) return [];

  const cleanedText = cleanText(rawText);

  let chunks: string[] = [];

  if (type === "qa") {
    chunks = splitQA(cleanedText);
  } else {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 100,
    });
    chunks = await splitter.splitText(cleanedText);
  }

  const sizeInBytes = new TextEncoder().encode(cleanedText).length;

  const records: ChunkWithEmbedding[] = [];

  await connectDB();

  const source = await Source.create({
    workspace: workspaceId,
    agent: agentId,
    title,
    words,
    type,
    size: sizeInBytes
  });

  console.log(source);

  for (const chunk of chunks) {
    const { embedding } = await embed({
      model: google.textEmbeddingModel("text-embedding-004"),
      value: chunk,
    });

    records.push({
      id: `${workspaceId}:${agentId}:${source._id}:${crypto.randomUUID()}`,
      text: chunk,
      embedding,
      workspaceId,
      agentId,
      sourceId: source._id.toString(),
    });
  }

  console.log(records);

  return records;
}

function cleanText(text: string) {
  return text
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/^\d+\s*\n/gm, "")
    .trim();
}

function splitQA(text: string): string[] {
  return text
    .split(/\n(?=Q:)/)
    .map((b) => b.trim())
    .filter(Boolean);
}
