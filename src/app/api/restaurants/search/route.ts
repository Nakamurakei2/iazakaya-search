import { NextRequest, NextResponse } from "next/server";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

/**
 * レストラン情報取得API
 */
export async function GET(req: NextRequest) {
  try {
    const lat = req.nextUrl.searchParams.get("lat");
    const lng = req.nextUrl.searchParams.get("lng");
    const count = req.nextUrl.searchParams.get("count");
    const start = req.nextUrl.searchParams.get("start");
    const genre = req.nextUrl.searchParams.get("genre");

    const params = new URLSearchParams({
      count: String(count),
      start: String(start),
      format: "json",
    });

    // locationの値があれば格納、なければ格納しないって構造に変更する必要あり
    if (lat && lng) {
      params.append("lat", String(lat));
      params.append("lng", String(lng));
    }
    if (genre) {
      const genreArray = genre.split(",");
      genreArray.forEach((g) => {
        params.append("genre", g);
      });
    }

    const apiUrl = `${apiBaseUrl}&${params}&format=json`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error("レストランデータの取得に失敗しました。");
      return NextResponse.json(
        {
          message: "データの取得に失敗しました。",
        },
        { status: 500 },
      );
    }
    const data = await res.json();
    return NextResponse.json(
      {
        message: "レストランデータの取得に成功しました。",
        shops: data.results.shop,
        results_available: data.results.results_available, // 検索結果の全件数
        results_returned: data.results.results_returned, // 返却した検索結果の件数
        results_start: data.results.results_start, // 検索結果の開始位置
      },
      { status: 200 },
    );
  } catch (e: unknown) {
    console.error("e", e);
    if (e instanceof Error) {
      return NextResponse.json(
        {
          message: "データの取得に失敗しました。",
          detail: e.message,
        },
        { status: 500 },
      );
    }
  }
}
