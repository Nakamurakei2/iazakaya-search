import { NextRequest, NextResponse } from "next/server";

type LatLngType = {
  x: number; // longitude
  y: number; // latitude
};

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

/**
 * レストラン情報取得API
 */
export async function GET(req: NextRequest) {
  // 駅名の緯度・経度
  let latitude;
  let longitude;

  try {
    const lat = req.nextUrl.searchParams.get("lat");
    const lng = req.nextUrl.searchParams.get("lng");
    const count = req.nextUrl.searchParams.get("count");
    const start = req.nextUrl.searchParams.get("start");
    const station = req.nextUrl.searchParams.get("station");
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
    } else if (station) {
      // stationから緯度・経度を取得する
      const res = await fetch(
        `https://express.heartrails.com/api/json?method=getStations&name=${station}`,
        {
          method: "GET",
        },
      );

      const data = await res.json();
      const { x, y }: LatLngType = data.response.station[0];
      latitude = y;
      longitude = x;

      if (x && y) {
        params.append("lat", String(latitude));
        params.append("lng", String(longitude));
      }
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
        // latitudeが存在する場合のみオブジェクトに展開する
        ...(latitude && { target_latitude: String(latitude) }),
        ...(longitude && { target_longitude: String(longitude) }),
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
