import { pool } from "@/lib/pool";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams.get("inputValue");

  try {
    const query = `
    SELECT station_id, name, lat, lon, address
    FROM stations
    WHERE name LIKE $1
      OR hiragana LIKE $1
    `;

    const result = await pool.query(query, [`%${params}%`]);
    // 該当なし
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "該当なし", stations: [] },
        { status: 204 },
      );
    }

    return NextResponse.json(
      {
        message: "成功",
        stations: result.rows,
      },
      {
        status: 200,
      },
    );
  } catch (e: unknown) {
    console.error("e", e);
  }
}
