import { Dispatch, RefObject, SetStateAction } from "react";

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
    pc: {
      l: string;
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
  sub_genre: {
    name: string;
    code: string;
  };
  created_at: string;
  name_kana: string;
  catch: string;
  mobile_access: string;
};

export type ShopsType = RestaurantType & {
  distanceKm: number;
};

/**
 * 現在地から検索ボタン押下時のProps型定義
 */
export type Props = {
  pageSize: number;
  selectedGenres: string[];
  setStartPage: Dispatch<SetStateAction<number>>;
  setIsLocating: Dispatch<SetStateAction<boolean>>;
  setLocationNotice: Dispatch<SetStateAction<string>>;
  setCurrentLocationData: Dispatch<SetStateAction<Location | null>>;
  setTotalRestaurants: Dispatch<SetStateAction<number>>;
  setShops: Dispatch<SetStateAction<ShopsType[] | undefined>>;
  setStationName: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
};

/**
 * 入力欄の「虫眼鏡」アイコンクリック or Enterキー押下時のProps型定義
 */
export type SearchProps = {
  pageSize: number;
  selectedGenres: string[];
  startPage: number;
  stationName: string;
  setIsLocating: Dispatch<SetStateAction<boolean>>;
  setTotalRestaurants: Dispatch<SetStateAction<number>>;
  setShops: Dispatch<SetStateAction<ShopsType[] | undefined>>;
  setPage: Dispatch<SetStateAction<number>>;
  setLocationNotice: Dispatch<SetStateAction<string>>;
  setCurrentLocationData: Dispatch<SetStateAction<Location | null>>;
};

/**
 * ページネーションのPropsの型定義
 */
export type PaginationProps = {
  pageSize: number;
  startPage: number;
  currentLocationData: Location | null;
  setShops: Dispatch<SetStateAction<ShopsType[] | undefined>>;
  setPage: Dispatch<SetStateAction<number>>;
  setStartPage: Dispatch<SetStateAction<number>>;
  scrollRef: RefObject<HTMLDivElement | null>;
};

/**
 * ページネーションのボタン押下時のPropsの型定義
 */
export type PaginationButtonProps = {
  pageNumber: number;
  setStartPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  currentLocationData: Location | null;
  setShops: Dispatch<SetStateAction<ShopsType[] | undefined>>;
  setPage: Dispatch<SetStateAction<number>>;
};

/**
 * レストランIDの型定義
 */
export type AddFavoritesButtonProps = {
  restaurantId: string;
};

/**
 * お気に入り登録ずみのレストランIDの型定義
 */
export interface FavoriteItem {
  restaurant_id: string;
  created_at?: string;
}

/**
 * お気に入り登録APIの型定義
 */
export interface FavoriteFormProps {
  data: FavoriteItem[];
}
