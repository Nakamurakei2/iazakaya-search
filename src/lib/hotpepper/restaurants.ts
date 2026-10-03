import { Criteria } from "../gemini/types";

const apiBaseUrl = `${process.env.HOT_PEPPER_BEAUTY_BASE_URL}?key=${process.env.HOT_PEPPER_BEAUTY_API_KEY}`;

/**
 * hotPepperグルメAPIフェッチ処理
 */
export const hotPepperGourmetApi = async (criteria: Criteria) => {
  try {
    // geminiから受け取ったcriteriaをグルメAPIに渡してフェッチする。
    console.log("criteria", criteria);
    // criteriaの必須項目がnullだった場合の異常系を実装する
    // 正常系として、全て揃った程で一旦開発を進める
    const area = criteria.area;
    const people = criteria.people;
    const startTime = criteria.startTime; // startTimeにて日時指定した上でグルメAPIからレスポンスは持って来れない
    const budget = criteria.budget;
    const genre = criteria.genre;
    const atmosphere = criteria.atmosphere;

    if (!area) {
      // 異常系を実装
    }
    const params = new URLSearchParams();

    if (people) params.append("party_capacity", people);
    if (budget) params.append("budget", budget);
    if (genre) {
      const genreString: string = genre.join(",");
      params.append("genre", genreString);
    }
    if (atmosphere) params.append("keyword", atmosphere);

    // API fetch
    const res = await fetch(`${apiBaseUrl}&${params.toString()}&format=json`);
    const data = await res.json();
    console.log("data!!!!", data);
  } catch (e: unknown) {
    console.error("e", e);
  }
};
