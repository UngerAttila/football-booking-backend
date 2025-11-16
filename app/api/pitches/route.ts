import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const cors = {
  "Access-Control-Allow-Origin": "http://localhost:8080",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  const items = await prisma.pitch.findMany();
  return NextResponse.json(items, { headers: cors });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, surfaceType, pricePerHour, hasLights, isIndoor, size, description } =
      body;

    if (
      !name ||
      !location ||
      !surfaceType ||
      pricePerHour === undefined ||
      hasLights === undefined ||
      isIndoor === undefined
    ) {
      return NextResponse.json(
        { error: "Hiányzó kötelező mező(k)." },
        { status: 400, headers: cors },
      );
    }

    const created = await prisma.pitch.create({
      data: {
        name,
        location,
        surfaceType,
        pricePerHour,
        hasLights,
        isIndoor,
        size: size || null,
        description: description || null,
      },
    });

    return NextResponse.json(created, { status: 201, headers: cors });
  } catch (err: any) {
    console.error("PITCH_CREATE_ERROR", err);
    return NextResponse.json(
      { error: err?.message || "Hiba mentés közben." },
      { status: 500, headers: cors },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Hiányzó id a query-ben (?id=...)" },
        { status: 400, headers: cors },
      );
    }

    const deleted = await prisma.pitch.delete({ where: { id } });
    return NextResponse.json(deleted, { headers: cors });
  } catch (err: any) {
    console.error("PITCH_DELETE_ERROR", err);
    return NextResponse.json(
      { error: err?.message || "Törlés közben hiba." },
      { status: 500, headers: cors },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors });
}
