import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const { count, sales } = await request.json();

    if (typeof count === 'number') {
      await prisma.globalStat.upsert({
        where: { id: "view_counter" },
        update: { count },
        create: { id: "view_counter", count }
      });
    }

    if (typeof sales === 'number') {
      await prisma.globalStat.upsert({
        where: { id: "sales_counter" },
        update: { count: sales },
        create: { id: "sales_counter", count: sales }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating counter:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
