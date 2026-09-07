"use client";

import { ConfirmDialog } from "@/components/confirmDailog";
import { Dialog } from "@/components/dialog";
import { Pagination } from "@/components/pagination";
import { ShopsType } from "@/types/restaurant";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { toast } from "sonner";

type Props = {
  shops: ShopsType[];
  restaurantsTotal: number;
};

/**
 * 履歴フォームページ
 */
export default function RecentForm(props: Props) {
  const { shops, restaurantsTotal } = props;
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>(""); // 詳細ダイアログに渡すためのrestaurantId
  const [confirmTarget, setConfirmTarget] = useState<ShopsType | null>(null); // 削除確認ダイアログ
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); // お気に入り登録
  const selected = shops?.find((s) => s.id === selectedId) || null; // 詳細ダイアログ
  const [page, setPage] = useState<number>(1); // ページネーション用の現在どのページを表す
  const [pageSize, setPageSize] = useState(10); // 取得件数
  const [totalRestaurants, setTotalRestaurants] =
    useState<number>(restaurantsTotal); // 該当したレストラン総数
  const [restaurants, setRestaurants] = useState<ShopsType[]>(shops);

  /**
   * 「お気に入り解除」ボタン押下時処理
   */
  const handleRemoveFavorites = () => {
    setConfirmTarget(selected);
  };

  /**
   * 「削除する」ボタン押下時処理
   */
  const confirmRemoveFavorite = async (target: ShopsType): Promise<void> => {
    const { id } = target;
    try {
      const res = await fetch(`/api/restaurants/${id}/favorites`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message);
        return;
      }
      const data = await res.json();
      toast.success(data.message); // 店名込みで表示させた方が良い？
      setConfirmTarget(null); // モーダル閉じる
      setSelectedId(""); // 詳細モーダルを閉じる

      router.refresh(); // サーバーへ最新データを取得するリクエストを送り更新する
    } catch (e: unknown) {
      if (e instanceof TypeError) {
        console.error("ネットワークエラーが発生しました:", e.message);
        // ユーザーへの通知: "インターネットに接続されていません。回線状況を確認してください。"
        toast.error(
          "インターネットに接続されていません。回線状況を確認してください。",
        );
        return;
      }

      console.error("予期せぬエラー", e);
      toast.error(
        "予期せぬエラーが発生しました。時間をおいてから再度実行してください",
      );
    }
  };

  /**
   * 履歴カード
   */
  const RecentCard = ({ restaurants }: { restaurants: ShopsType }) => {
    return (
      <div
        className="group relative flex h-[120px] overflow-hidden rounded-[24px] bg-[#201f1f] shadow-[0px_10px_30px_rgba(255,140,0,0.08)] transition-transform hover:-translate-y-1"
        onClick={() => setSelectedId(restaurants.id)}
      >
        {/* Image */}
        <div className="h-full w-[120px] shrink-0">
          <img
            className="h-full w-full object-cover"
            src={restaurants.photo.pc.l}
            alt={restaurants.name}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h4 className="line-clamp-1 text-[18px] font-medium leading-7 text-[#e5e2e1]">
              {restaurants.name}
            </h4>
          </div>
          <h5>{restaurants.station_name}駅</h5>
          <button
            type="button"
            className="flex items-center gap-1 self-end text-sm font-bold leading-5 text-[#ffb77d] transition-colors hover:text-[#ff8c00]"
          >
            View
            <MdArrowForward className="text-[16px]" />
          </button>
        </div>
      </div>
    );
  };

  /**
   * ページネーション前へ進むボタン
   */
  const handlePaginatePrevious = async () => {
    try {
      const params = new URLSearchParams({
        offset: String((page - 2) * pageSize),
        limit: String(pageSize),
      });

      const res = await fetch(
        `/api/restaurants/histories?${params.toString()}`,
        {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        console.error("data", data);
        return;
      }

      const data = await res.json();
      const restaurants = data.shops;
      setRestaurants(restaurants);
      setTotalRestaurants(data.totalRestaurants);
      window.scrollTo({ top: 0, behavior: "instant" });
      setPage((prev) => prev - 1);
    } catch (e: unknown) {
      console.error("e", e);
    }
  };

  /**
   * ページネーション次へ進むボタン
   */
  const handlePaginateNext = async () => {
    try {
      const params = new URLSearchParams({
        offset: String(page * pageSize),
        limit: String(pageSize),
      });

      const res = await fetch(
        `/api/restaurants/histories?${params.toString()}`,
        {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        console.error("data", data);
        return;
      }

      const data = await res.json();
      const restaurants = data.shops;
      setRestaurants(restaurants);
      setTotalRestaurants(data.totalRestaurants);
      window.scrollTo({ top: 0, behavior: "instant" });
      setPage((prev) => prev + 1);
    } catch (e: unknown) {
      console.error("e", e);
    }
  };

  /**
   * ページネーションのボタン
   */
  const handlePaginateButtonClick = async (n: number) => {
    try {
      const params = new URLSearchParams({
        offset: String((n - 1) * pageSize),
        limit: String(pageSize),
      });

      const res = await fetch(
        `/api/restaurants/histories?${params.toString()}`,
        {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        console.error("data", data);
        return;
      }

      const data = await res.json();
      const restaurants = data.shops;
      setRestaurants(restaurants);
      setTotalRestaurants(data.totalRestaurants);
      window.scrollTo({ top: 0, behavior: "instant" });
      setPage(n);
    } catch (e: unknown) {
      console.error("e", e);
    }
  };

  return (
    <>
      <div className="bg-[#131313] text-[#e5e2e1] md:pb-0">
        <div className="px-5 pt-20 md:mx-auto md:max-w-[1200px]">
          <h2 className="mb-8 text-[28px] font-bold leading-9 text-[#e5e2e1] md:text-[32px] md:leading-10">
            Recent Views
          </h2>

          {restaurants.length > 0 && (
            <section className="mb-12">
              {/* <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ddc1ae]">
                Today
              </h3> */}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                  <RecentCard key={restaurant.id} restaurants={restaurant} />
                ))}
              </div>
            </section>
          )}

          {restaurants.length === 0 && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-[16px] text-[#ddc1ae]">No recent views.</p>
            </div>
          )}
        </div>
      </div>

      {Math.ceil(totalRestaurants / pageSize) > 1 ? (
        <Pagination
          page={page}
          totalRestaurants={Math.ceil(totalRestaurants / pageSize)}
          handlePaginatePrevious={handlePaginatePrevious}
          handlePaginateNext={handlePaginateNext}
          handlePaginateButtonClick={handlePaginateButtonClick}
        />
      ) : (
        <div className="h-15"></div>
      )}

      {/* 詳細ダイアログ */}
      {selected && (
        <Dialog
          selected={selected}
          setSelectedId={setSelectedId}
          authorized={true}
          favoriteIds={favoriteIds}
          setFavoriteIds={setFavoriteIds}
          handleRemoveFavorites={handleRemoveFavorites}
        />
      )}

      {/* 削除確認ダイアログ */}
      {selected && confirmTarget && (
        <ConfirmDialog
          target={confirmTarget}
          setSelectedId={setSelectedId}
          confirmRemoveFavorite={confirmRemoveFavorite}
          setConfirmTarget={setConfirmTarget}
        />
      )}
    </>
  );
}
