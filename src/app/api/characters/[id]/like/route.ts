import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isUpvoted } = body; // true means increment, false means decrement

    // Upsert the character: if it doesn't exist, create it with 1 like (if liking) or 0 (if unliking, though ideally shouldn't happen)
    // If it exists, increment or decrement the likes.
    const character = await prisma.character.upsert({
      where: { id },
      update: {
        likes: {
          increment: isUpvoted ? 1 : -1,
        },
      },
      create: {
        id,
        likes: isUpvoted ? 1 : 0,
      },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.error("Failed to update character likes:", error);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
