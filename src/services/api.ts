import { useState } from "react";
import { Izakayas } from "@/types/restaurant";

// タイムアウトエラー(10秒)
const TIMEOUT_ERROR = 10000;

// TODO：station or lat, lngのどちらかを必須にする型定義へ変更
type UseMutationRestaurantProps = {
  station?: string;
  lat?: number;
  lng?: number;
  start: number;
  count?: number;
  genre?: string;
};

type MutationOptions = {
  onSuccess?: (data: Izakayas[]) => void;
};

/**
 * レストラン検索API
 * @returns レストラン一覧
 */

// 後ほどuseQueryへ変更する
export const useMutationRestaurant = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    props: UseMutationRestaurantProps,
    options?: MutationOptions,
  ) => {
    const { station, lat, lng, start, count, genre } = props;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT_ERROR);

    const queryParams: UseMutationRestaurantProps = {
      start,
      ...(station && { station }),
      ...(lat !== undefined && { lat }),
      ...(lng !== undefined && { lng }),
      ...(count && { count }),
      ...(genre && { genre }),
    };

    const stringParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(queryParams)) {
      stringParams[key] = String(value);
    }
    const innerQueryString = new URLSearchParams(stringParams).toString();
    const outerQueryString = new URLSearchParams({
      q: innerQueryString,
    }).toString();

    try {
      setIsPending(true);
      const res = await fetch(`http://localhost:5000/v1/search?${outerQueryString}`, {
        method: "GET",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("failed to fetch");
      const data = await res.json();
      const result = data.data.results.shop as Izakayas[];
      options?.onSuccess?.(result);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          "通信がタイムアウトしました。電波の良い場所で再度お試しください。",
        );
      }
      console.error("error", error);
    } finally {
      clearTimeout(id);
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};

/**
 * 居酒屋検索API
 * @returns
 */
export const useQueryRestaurants = () => {
  // return useQuery({
  //   queryKey: [],
  //   queryFn: () => {},
  //   // useQueryが自動でAPIを叩きにいくことを許可するかどうか
  //   enabled: false,
  // });
};

/**
 * 認証情報取得API
 * @returns ログイン済みかどうか
 */
export const useAuthenticationQuery = () => {
  // return useQuery({
  //   queryKey: ["authStatus"],
  //   queryFn: async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/v1/auth/check", {
  //         method: "GET",
  //         credentials: "include", // includeを指定することで、自動でCookieの値を付与してくれる
  //         signal: AbortSignal.timeout(10000),
  //       });
  //       const data = await res.json();

  //       return {
  //         status: res.status,
  //         res: data,
  //       };
  //     } catch (err: unknown) {
  //       console.error("err occurred", err);
  //       if (err instanceof Error) {
  //         if (err.name === "TimeoutError") {
  //           throw new Error("認証情報取得に失敗しました。");
  //         } else {
  //           throw new Error(err.message);
  //         }
  //       }
  //     }
  //   },
  //   retry: false,
  //   // useQueryが自動でAPIを叩きにいくことを許可するかどうか
  //   enabled: true, // Cookieは常に監視するべきなのでtrueに設定
  //   // データを取得してからそのデータが「最新」であると信頼する時間を0m秒に指定
  //   staleTime: 1000 * 60 * 5, // 5分に設定（isPendingで使い勝手が悪いため）
  //   // ユーザーがブラウザの他のタブを見たり、別のアプリを触った後に再びこの画面にフォーカスが戻った瞬間に裏でAPIを叩くかどうか
  //   refetchOnWindowFocus: true,
  //   // このuseQueryを使っているコンポーネントが新しく画面に描画（マウント）された瞬間に裏でAPIを叩くかどうか
  //   refetchOnMount: true,
  //   // パソコンが通信切れになった後、ネットに繋がったり再度復活してオンラインになった瞬間に裏でAPIを叩くかどうか
  //   refetchOnReconnect: true,
  // });
};
