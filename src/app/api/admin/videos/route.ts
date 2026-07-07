import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const videos = await prisma.celebrityVideo.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const count = await prisma.celebrityVideo.count();
    
    const video = await prisma.celebrityVideo.create({
      data: {
        title: data.title,
        src: data.src,
        poster: data.poster || null,
        order: count, // Add to the end
      }
    });
    return NextResponse.json(video);
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Check if it's a reorder operation
    if (data.reorder && Array.isArray(data.items)) {
      // items is an array of { id, order }
      const updates = data.items.map((item: any) => 
        prisma.celebrityVideo.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      );
      await prisma.$transaction(updates);
      return NextResponse.json({ success: true });
    }
    
    // Otherwise it's a normal update
    const { id, ...updateData } = data;
    const video = await prisma.celebrityVideo.update({
      where: { id },
      data: updateData
    });
    return NextResponse.json(video);
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    await prisma.celebrityVideo.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
