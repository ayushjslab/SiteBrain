import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error("DB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to database",
      },
      { status: 500 }
    );
  }
}
