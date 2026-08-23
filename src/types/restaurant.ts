interface GenreStyleValue {
  name: string;
  c: string;
}

export type GenreStyleMap = {
  [code: string]: GenreStyleValue | undefined;
};

export const GENRE_STYLE: GenreStyleMap = {
  G001: { name: "居酒屋", c: "#3E8EA8" },
  G002: { name: "ダイニングバー・バル", c: "#7A5FB0" },
  G003: { name: "創作料理", c: "#7A5FB0" },
  G004: { name: "和食", c: "#7A5FB0" }, // 焼き鳥・おでん等もここに含まれることが多い
  G005: { name: "洋食", c: "#5C7A4B" },
  G006: { name: "イタリアン・フレンチ", c: "#5C7A4B" },
  G007: { name: "中華", c: "#D9A441" },
  G008: { name: "焼肉・ホルモン", c: "#A83232" },
  G009: { name: "アジア・エスニック料理", c: "#D9A441" },
  G013: { name: "ラーメン", c: "#D9A441" },
  G014: { name: "カフェ・スイーツ", c: "#C98A2C" },
  G017: { name: "韓国料理", c: "#A83232" },

  // マスタにないコード、またはコード自体が取れなかった場合のフォールバック
  default: { name: "その他", c: "#888888" },
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type RestaurantType = {
  id: string;
  access: string;
  name: string;
  station_name: string;
  genre: {
    name: string;
    code: string;
  };
  lat: number;
  lng: number;
  open: string;
  photo: {
    mobile: {
      l: string;
      s: string;
    };
  };
  urls: {
    pc: string;
  };
  budget: {
    name: string;
  };
  close: string;
  capacity: string;
};

export type ShopsType = RestaurantType & {
  distanceKm: number;
};