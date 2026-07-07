import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let viewStat = await prisma.globalStat.findUnique({
      where: { id: "view_counter" }
    });

    let salesStat = await prisma.globalStat.findUnique({
      where: { id: "sales_counter" }
    });

    if (!viewStat) {
      viewStat = await prisma.globalStat.create({
        data: { id: "view_counter", count: 51347 }
      });
    }

    if (!salesStat) {
      salesStat = await prisma.globalStat.create({
        data: { id: "sales_counter", count: 265000 }
      });
    }

    return NextResponse.json({ count: viewStat.count, sales: salesStat.count });
  } catch (error) {
    console.error("Error fetching counter:", error);
    return NextResponse.json({ count: 51347, sales: 265000 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const viewStat = await prisma.globalStat.upsert({
      where: { id: "view_counter" },
      update: { count: { increment: 1 } },
      create: { id: "view_counter", count: 51347 }
    });

    const salesStat = await prisma.globalStat.upsert({
      where: { id: "sales_counter" },
      update: { count: { increment: 1 } },
      create: { id: "sales_counter", count: 265000 }
    });

    return NextResponse.json({ count: viewStat.count, sales: salesStat.count });
  } catch (error) {
    console.error("Error updating counter:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
