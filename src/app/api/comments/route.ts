import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const theoryId = searchParams.get("theoryId");

  if (!theoryId) {
    return NextResponse.json({ error: "theoryId is required" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { theoryId },
      orderBy: { createdAt: 'asc' }
    });

    const formatted = comments.map((c: any) => ({
      id: c.id,
      theoryId: c.theoryId,
      author: c.author,
      text: c.text,
      upvotes: c.upvotes,
      createdAt: c.createdAt.toISOString()
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { theoryId, author, text } = body;
    
    if (!theoryId || !author || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        theoryId,
        author,
        text
      }
    });

    return NextResponse.json(newComment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
