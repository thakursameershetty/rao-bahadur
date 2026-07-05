import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isUpvoted } = body;
    
    const updated = await prisma.theory.update({
      where: { id },
      data: { upvotes: { [isUpvoted ? 'increment' : 'decrement']: 1 } }
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
