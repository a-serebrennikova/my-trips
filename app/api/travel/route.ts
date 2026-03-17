import { NextResponse } from "next/server";
import { getAllTravelData } from "@/lib/serverTravelDb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Ограничиваем максимальное значение limit для предотвращения чрезмерной нагрузки
  const safeLimit = Math.min(limit, 100);

  const data = await getAllTravelData(safeLimit, offset);
  return NextResponse.json(data);
}
