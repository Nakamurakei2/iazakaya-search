import { NextRequest, NextResponse } from "next/server";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

/**
 * レストラン情報取得API
 */
export async function GET(req: NextRequest) {
  const restaurant_id = req.nextUrl.searchParams.get("restaurant_id");
  try {
    const res = await fetch(`${apiBaseUrl}&id=${restaurant_id}&format=json`);
    const data = await res.json();

    const shops = data.results.shop;
    if (!res.ok) {
      return null;
    }
    return NextResponse.json(
      {
        message: "データの取得に成功しました。",
        restaurants: shops,
      },
      {
        status: 200,
      },
    );
  } catch (e: unknown) {
    console.error("e", e);

    return NextResponse.json(
      {
        message:
          "不明なエラーが発生しました。時間をおいて再度実行してください。",
      },
      { status: 500 },
    );
  }
}
