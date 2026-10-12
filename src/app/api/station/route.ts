import { pool } from "@/lib/pool";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams.get("station");

  // 将来的にはidで検索できるようにしたい
  try {
    const query = `
    SELECT lat, lon
    FROM stations 
    WHERE name = $1
    `;

    const result = await pool.query(query, [params]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          message: "該当なし",
        },
        { status: 204 },
      );
    }

    return NextResponse.json(
      {
        message: "成功",
        result: result.rows[0],
      },
      {
        status: 200,
      },
    );
  } catch (e: unknown) {
    console.error("e", e);
  }
}
