// Gemini APIでのレスポンス型
export type GeminiAPIResponse = {
  criteria: Criteria;
} & {
  interactionId: string;
};

export type Criteria = {
  /** エリア */
  area: string | null;
  /** 人数 */
  people: string | null;
  /** 予約開始時間 */
  startTime: string | null;
  /** 予算 */
  budget: string | null;
  /** ジャンル */
  genre: string[] | null;
  /** 空気感（オシャレな..など） */
  atmosphere: string | null;
};
