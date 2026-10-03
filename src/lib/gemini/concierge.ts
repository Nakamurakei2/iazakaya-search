import { GoogleGenAI } from "@google/genai";
import { GeminiAPIResponse } from "./types";

type Props = {
  input: string;
};

export const geminiAi = async (props: Props): Promise<GeminiAPIResponse> => {
  const { input } = props;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const interaction = await ai.interactions.create({
      model: "models/gemini-3.6-flash",
      input: buildPromp(input),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: {
          type: "object",
          properties: {
            area: {
              type: "string",
            },
            people: {
              type: ["integer", "null"],
            },
            startTime: {
              type: ["string", "null"],
            },
            budget: {
              type: ["number", "null"],
            },
            genres: {
              type: "array",
              items: {
                type: "string",
              },
            },
            atmosphere: {
              type: ["string", "null"],
            },
          },
          required: [
            "area",
            "people",
            "startTime",
            "budget",
            "genres",
            "atmosphere",
          ],
        },
      },
    });

    // convert Gemini api results into JSON
    if (!interaction.output_text) {
      throw new Error("AI response is empty");
    }
    const criteria = JSON.parse(interaction.output_text);
    const interactionId = interaction.id;
    const returnData = { criteria, interactionId };
    console.log("returnData", returnData);

    return returnData;

    // // hotPepper APIへ渡す
    // const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

    // // 検索エリア(必須)
    // const area = criteria.area;
    // // 検索人数(返ってこなれば１名でも検索可能に)
    // const people = criteria.people;
    // // 開始時間（無しの場合はなしで検索）
    // const startTime = criteria.startTime;
    // // 予算（希望がなければなしで検索）
    // const budget = criteria.budget;
    // // ジャンル（希望がなければなしで検索）
    // const genre = criteria.genre;
    // // atmosphere(オシャレ　など)
    // const atmosphere = criteria.atmosphere;
    // // preference（希望がなければなしで検索）
    // const preference = criteria.preference;

    // genreをCodeへ変換
    // const genreCode = getGenreCode(criteria.genres);

    // 場所について指定がなければ場所について質問を返す
    // if (!area) {
    //   // return NextRespons.json({
    //   //   type: "clarification",
    //   //   message: "どのエリアのお店をお探しですか？",
    //   // });
    // }
    // const params = new URLSearchParams();
    // if (area) params.append("keyword", area);

    // const hotpepperRes = await fetch(
    //   `${apiBaseUrl}&${params.toString()}&format=json`,
    // );
    // const hotpepperData = await hotpepperRes.json();
    // console.log("hotpepperData", hotpepperData);

    // const restaurantData = hotpepperData.shop[0];

    /**
     *
     * 出力一例
     * data.outputText {
      "area": "横浜駅",
      "people": 2,
      "startTime": null,
      "budget": null,
      "stops": null,
      "genres": [
        "イタリアン"
      ],
      "atmosphere": "オシャレ",
      "preferences": null
    }
     */

    // グルメAPI
    // 最終的にグルメAPIに渡したい情報としては、
    /**
     * areaから取得したlat. lng
     * peopleから取得した人数　：party_capacty?
     * startTime：これはグルメAPIでは絞り込みできなさそう
     * budget：予算絞り込み
     * genre: ジャンルコード
     * keyword: 賑やか、だとかオシャレだとかの文言が入力された場合にグルメAPIに渡す？
     *
     */

    // return NextResponse.json(
    //   {
    //     message: "AI fetch success",
    //     outputText: interaction?.output_text,
    //     restaurantData,
    //   },
    //   {
    //     status: 200,
    //   },
    // );
    // return {
    //   outputText: interaction?.output_text,
    // };
  } catch (e: unknown) {
    console.error("e", e);
    throw new Error("Gemini api failed");
  }
};

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
