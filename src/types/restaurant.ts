/**
 * ジャンル
 * G001：居酒屋
 * G002：ダイニングバー
 * G003：創作料理
 * G004：和食
 * G005：洋食
 * G006：イタリアン・フレンチ
 * G008：焼肉
 * G013：ラーメン・麺類
 * G014：カフェ・スイーツ
 */
export enum Genre {
  G001 = "G001",
  G002 = "G002",
  G003 = "G003",
  G004 = "G004",
  G005 = "G005",
  G006 = "G006",
  G008 = "G008",
  G013 = "G013",
  G014 = "G014",
}

export type Budget = "standard" | "premium" | "light";

export type Venue = {
  name: string;
  area: string;
  walk: string;
  genre: {
    name: string;
  };
  price: string;
  tags: string[];
  highlight: string;
  status: "available" | "limited" | "request";
  distance: number | undefined;
  catch: string;
};

export type Plan = {
  id: string;
  title: string;
  fit: string;
  mood: string;
  first: Venue;
  second: Venue;
  total: string;
  move: string;
};

export type Izakayas = {
  id: string;
  // アクセス
  access: string;
  // 住所
  address: string;
  // 平均予算
  budget: {
    average: string;
    name: string; // "2001～3000円"
  };
  // カード決済
  card: string;
  budget_memo: string; // "りそなPay/EPOSPayその他各種※お通し代:有"
  // 借り切り
  charter: string;
  // 子連れ
  child: string;
  // コース
  course: string;
  // 飲み放題
  free_drink: string;
  // 食べ放題
  free_food: string;
  // 店名
  name: string;
  // 店名（かな）
  name_kana: string;
  // 喫煙
  non_smoking: string;
  // オープン
  open: string;
  //写真
  photo: {
    // SP
    mobile: {
      l: string;
      s: string;
    };
    pc: {
      l: string;
      s: string;
    };
  };
  // 詳細
  shop_detail_memo: string;
  // 店舗URL
  urls: {
    pc: string;
  };
  // ジャンル
  genre: {
    name: string;
  };
  // 最寄り駅
  station_name: string;
  // 定休日
  close: string;
  // 電話番号
  tel: string;
  // 緯度
  lat: number;
  // 経度
  lng: number;
  // お店までの直線距離一覧
  distances: number[] | undefined;
  // お店までの距離
  distance?: number;
  // キャッチ文
  catch: string;
};

export const budgets: Array<{ label: string; value: Budget }> = [
  { label: "バランス", value: "standard" },
  { label: "少し良い店", value: "premium" },
  { label: "軽め", value: "light" },
];

export const genres: Array<{ label: string; value: Genre }> = [
  { label: "居酒屋", value: Genre.G001 },
  { label: "ダイニング・バー", value: Genre.G002 },
  { label: "和食", value: Genre.G004 },
  { label: "洋食", value: Genre.G005 },
  { label: "イタリアン・フレンチ", value: Genre.G006 },
  { label: "焼肉・ホルモン", value: Genre.G008 },
  { label: "ラーメン・麺類", value: Genre.G013 },
  { label: "カフェ・スイーツ", value: Genre.G014 },
];
