const WEEK_MAP = ["日", "月", "火", "水", "木", "金", "土"];

export const dateAndBusinessHours = (open: string): string => {
  if (!open) return "営業時間不明";

  const now = new Date();
  const today = WEEK_MAP[now.getDay()];
  const lines = open.split("\n");
  const todayLine = lines.find((line) => line.includes(today)) || open;
  // 営業時間だけ抜き出す
  const timeMatch = todayLine.match(
    /(\d{1,2}:\d{2})\s*～\s*(翌)?(\d{1,2}:\d{2})/,
  );

  if (!timeMatch) return "営業時間不明";

  const start = timeMatch[1];
  const end = timeMatch[3];

  return `本日(${today})：${start} ～ ${end}`;
};
