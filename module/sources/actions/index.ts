"use server";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { connectDB } from "@/lib/connectDB";
import Source from "@/models/source";
import { qdrant } from "@/lib/qdrant";

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

  if (chunks.length === 0) return [];

  const sizeInBytes = new TextEncoder().encode(cleanedText).length;
  const records: ChunkWithEmbedding[] = [];

  await connectDB();

  const source = await Source.create({
    workspace: workspaceId,
    agent: agentId,
    title,
    words,
    type,
    size: sizeInBytes,
  });

  const points = [];

  for (const chunk of chunks) {
    const { embedding } = await embed({
      model: google.textEmbeddingModel("text-embedding-004"),
      value: chunk,
    });

    const pointId = crypto.randomUUID();

    points.push({
      id: pointId,
      vector: embedding,
      payload: {
        text: chunk,
        workspaceId,
        agentId,
        sourceId: source._id.toString(),
      },
    });

    records.push({
      id: pointId,
      text: chunk,
      embedding,
      workspaceId,
      agentId,
      sourceId: source._id.toString(),
    });
  }

  try {
    await qdrant.getCollection("chunks");
  } catch (error) {
    await qdrant.createCollection("chunks", {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    });
  }

  await qdrant.upsert("chunks", {
    points,
  });

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

export async function sourceFetching({
  workspaceId,
  agentId,
  type,
}: {
  workspaceId: string;
  agentId: string;
  type: string;
}) {
  try {
    if (!workspaceId || !agentId || !type) {
      return {
        error: "Missing required fields",
        success: false,
      };
    }

    await connectDB();

    const sources = await Source.find({
      workspace: workspaceId,
      agent: agentId,
      type,
    })
      .select("title words size createdAt")
      .lean();

    const sourcesPlain = sources.map((source) => ({
      _id: source._id.toString(),
      title: source.title,
      words: source.words,
      size: source.size,
      createdAt: source.createdAt?.toISOString(),
    }));

    return {
      success: true,
      sources: sourcesPlain,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to fetch sources",
      success: false,
    };
  }
}

export async function searchSimilarChunks({
  query,
  workspaceId,
  agentId,
  limit = 5,
}: {
  query: string;
  workspaceId: string;
  agentId: string;
  limit?: number;
}) {
  const { embedding } = await embed({
    model: google.textEmbeddingModel("text-embedding-004"),
    value: query,
  });

  const searchResults = await qdrant.search("chunks", {
    vector: embedding,
    limit,
    filter: {
      must: [
        {
          key: "workspaceId",
          match: { value: workspaceId },
        },
        {
          key: "agentId",
          match: { value: agentId },
        },
      ],
    },
  });

  return searchResults.map((result) => ({
    id: result.id,
    text: result?.payload?.text,
    score: result.score,
    sourceId: result?.payload?.sourceId,
  }));
}

export async function deleteChunksBySourceId(sourceId: string) {
  try {
    if (!sourceId) {
      return {
        success: false,
        error: "Missing source ID",
      };
    }

    await connectDB();

    await Source.deleteMany({ _id: sourceId });

    await qdrant.createPayloadIndex("chunks", {
      field_name: "sourceId",
      field_schema: "keyword",
      wait: true,
    });
    await qdrant.delete("chunks", {
      wait: true,
      filter: {
        must: [
          {
            key: "sourceId",
            match: { value: sourceId.toString() },
          },
        ],
      },
    });

    return {
      success: true,
      message: "Delete successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Error during deletion",
    };
  }
}

export async function retriveContextForQuery({
  query,
  workspaceId,
  agentId,
  topK = 5,
}: {
  query: string;
  workspaceId: string;
  agentId: string;
  topK?: number;
}) {
  try {
    // 1. Generate embedding
    const { embedding } = await embed({
      model: google.textEmbeddingModel("text-embedding-004"),
      value: query,
    });

    await qdrant.createPayloadIndex("chunks", {
      field_name: "workspaceId",
      field_schema: "keyword",
      wait: true,
    });
    const searchResults = await qdrant.search("chunks", {
      vector: embedding,
      limit: topK,
      score_threshold: 0.7,
      filter: {
        must: [
          { key: "workspaceId", match: { value: workspaceId } },
          { key: "agentId", match: { value: agentId } },
        ],
      },
    });

    const context = searchResults
      .filter((res) => res.payload?.text)
      .map((result, index) => ({
        rank: index + 1,
        text: result.payload!.text as string,
        score: result.score,
        sourceId: result.payload!.sourceId as string,
      }));

    const contextString = context
      .map((c) => `[${c.rank}] ${c.text}`)
      .join("\n\n");

    console.log(contextString);
    return {
      success: true,
      context,
      contextString,
      sources: [...new Set(context.map((c) => c.sourceId))],
    };
  } catch (error: any) {
    console.error(
      "Qdrant detailed error:",
      error.response?.data || error.data || error
    );
    return {
      success: false,
      error: "Failed to retrieve",
    };
  }
}
