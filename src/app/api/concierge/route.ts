import {
  createAiConversation,
  createAiSessions,
  updateAiSession,
} from "@/lib/db/concierge";
import { GoogleGenAI } from "@google/genai";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { geminiAi } from "@/lib/gemini/concierge";
import { GeminiAPIResponse } from "@/lib/gemini/types";
import { hotPepperGourmetApi } from "@/lib/hotpepper/restaurants";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  // input validation
  if (!input || typeof input !== "string") {
    return NextResponse.json({ message: "不正な入力です。" }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "認証情報が不正です" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;
    const userId = decoded.sub as string;

    // ①ai_sessionテーブルに格納
    const sessionId = await createAiSessions({ userId });

    // ②ai_conversationsテーブルにメッセージを保存
    await createAiConversation({
      sessionId,
      role: "user",
      content: input,
    });

    // ③Gemini API発火
    const geminiResult: Promise<GeminiAPIResponse> = geminiAi({ input });
    const { interactionId, criteria } = await geminiResult;

    // ④ai_sessionテーブルのUPDATE（interaction_idと、criteriaを挿入）
    const isSuccess = updateAiSession({ interactionId, criteria, sessionId });

    if (!isSuccess) {
      // update失敗した場合
    }

    // ⑤hotpepper API
    const hotpepperResult = hotPepperGourmetApi(criteria);

    return NextResponse.json({ message: "test" }, { status: 200 });
  } catch (e: unknown) {
    console.error("e", e);
  }
}

/**
 * プロンプト生成関数
 * @param input ユーザー入力値
 * @returns プロンプト
 */
const buildPromp = (input: string) =>
  `あなたは飲食店検索条件を解析するAIです。

  ユーザー入力から、以下の検索条件を抽出してください。

  - area: 検索対象のエリア
  - people: 人数
  - startTime: 開始時刻
  - budget: 1人あたりの予算
  - stops: 希望する店舗数
  - genres: 各店舗のジャンル
  - atmosphere: 雰囲気
  - preferences: その他の店舗希望

  ユーザーが指定していない項目は推測せず null としてください。

  飲食店検索と関係ない要求は処理しないでください。

  ユーザー入力:
  ${input}`;

/**
 * lat/lng取得
 */
const getLatLng = async (area: string) => {
  let trimmed;

  const regex = /駅/g;
  if (regex.test(area)) {
    trimmed = area.replace(regex, "");
  } else {
    trimmed = area;
  }
  try {
    // stationから緯度・経度を取得する
    const res = await fetch(
      `https://express.heartrails.com/api/json?method=getStations&name=${trimmed}`,
      {
        method: "GET",
      },
    );
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    console.log("lat", data);
  } catch (e: unknown) {
    console.error("e", e);
  }
};
