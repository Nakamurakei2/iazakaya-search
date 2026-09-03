"use client";

import { ConfirmDialog } from "@/components/confirmDailog";
import { Dialog } from "@/components/dialog";
import { ShopsType } from "@/types/restaurant";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { toast } from "sonner";

type Props = {
  shops: ShopsType[];
  authorized: boolean;
};

export default function RecentForm(props: Props) {
  const { shops, authorized } = props;
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string>(""); // 詳細ダイアログに渡すためのrestaurantId
  const [confirmTarget, setConfirmTarget] = useState<ShopsType | null>(null); // 削除確認ダイアログ
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); // お気に入り登録
  const selected = shops?.find((s) => s.id === selectedId) || null; // 詳細ダイアログ

  // レストランをcreated_at順に並び替え＆重複しているものは古い順から削除
  const orderedRestaurants = Array.from(
    new Map(shops.map((shop) => [shop.id, shop])).values(),
  ).sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
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
        "予期せぬエラーが発生しました。時間を押してから再度実行してください",
      );
    }
  };

  /**
   * 履歴カード
   */
  const RecentCard = ({ shop }: { shop: ShopsType }) => {
    return (
      <div
        className="group relative flex h-[120px] overflow-hidden rounded-[24px] bg-[#201f1f] shadow-[0px_10px_30px_rgba(255,140,0,0.08)] transition-transform hover:-translate-y-1"
        onClick={() => setSelectedId(shop.id)}
      >
        {/* Image */}
        <div className="h-full w-[120px] shrink-0">
          <img
            className="h-full w-full object-cover"
            src={shop.photo.pc.l}
            alt={shop.name}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h4 className="line-clamp-1 text-[18px] font-medium leading-7 text-[#e5e2e1]">
              {shop.name}
            </h4>
          </div>

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

  return (
    <>
      <div className="min-h-screen bg-[#131313] pb-24 text-[#e5e2e1] md:pb-0">
        <div className="mt-6 px-5 pt-20 md:mx-auto md:max-w-[1200px]">
          <h2 className="mb-8 text-[28px] font-bold leading-9 text-[#e5e2e1] md:text-[32px] md:leading-10">
            Recent Views
          </h2>

          {orderedRestaurants.length > 0 && (
            <section className="mb-12">
              {/* <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ddc1ae]">
                Today
              </h3> */}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orderedRestaurants.map((shop) => (
                  <RecentCard key={shop.id} shop={shop} />
                ))}
              </div>
            </section>
          )}

          {orderedRestaurants.length === 0 && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-[16px] text-[#ddc1ae]">No recent views.</p>
            </div>
          )}
        </div>
      </div>
      {/* 詳細ダイアログ */}
      {selected && (
        <Dialog
          selected={selected}
          setSelectedId={setSelectedId}
          authorized={authorized}
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
