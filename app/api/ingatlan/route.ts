import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const inggatlanok = await prisma.ingatlan.findMany({});
    return NextResponse.json(inggatlanok);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
