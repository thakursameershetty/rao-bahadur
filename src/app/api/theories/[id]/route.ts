import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Check if the theory exists first
    const theory = await prisma.theory.findUnique({
      where: { id }
    });

    if (!theory) {
      return NextResponse.json({ error: "Theory not found" }, { status: 404 });
    }

    // Since we don't have server-side authentication, we trust the client request to delete.
    // In a real app, we would verify the user session token matches the theory's author here.

    // To be safe, let's delete comments manually first to avoid foreign key constraints.
    await prisma.comment.deleteMany({
      where: { theoryId: id }
    });

    await prisma.theory.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete theory" }, { status: 500 });
  }
}
