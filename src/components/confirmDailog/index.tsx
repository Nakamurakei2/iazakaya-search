"use client";

import { ShopsType } from "@/types/restaurant";
import { QueryClient } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { Dispatch, SetStateAction } from "react";
import { MdHeartBroken } from "react-icons/md";
import { toast } from "sonner";

type Props = {
  setSelectedId: Dispatch<SetStateAction<string>>;
  target: ShopsType | null;
  setConfirmTarget: Dispatch<SetStateAction<ShopsType | null>>;
  router: AppRouterInstance;
  queryClient: QueryClient;
};

export const ConfirmDialog = (props: Props) => {
  const { setSelectedId, target, setConfirmTarget, router, queryClient } =
    props;

  /**
   * 削除確認ダイアログを閉じる
   */
  const handleClose = () => {
    setConfirmTarget(null);
  };

  /**
   * お気に入り削除ボタン押下時処理
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
      toast.success(data.message);
      setConfirmTarget(null); // モーダル閉じる
      setSelectedId(""); // 詳細モーダルを閉じる

      router.refresh(); // サーバーへ最新データを取得するリクエストを送り更新する
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[#131313]/30 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Dialog Container */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#131313]/30 px-5 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={handleClose}
      >
        <div
          className="flex w-full max-w-sm flex-col items-center overflow-hidden rounded-2xl border border-[#564334]/50 bg-[#353534] p-6 text-center shadow-[0px_10px_40px_rgba(255,140,0,0.1)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#93000a]/30 bg-[#93000a]/20">
            <MdHeartBroken className="text-[32px] text-[#ffb4ab]" />
          </div>

          {/* Content */}
          <h2
            id="dialog-title"
            className="mb-2 text-[24px] font-bold leading-8 text-[#e5e2e1]"
          >
            Remove from Favorites?
          </h2>

          <p className="mb-8 max-w-[280px] text-[16px] font-normal leading-6 text-[#ddc1ae]">
            Are you sure you want to remove this shop from your favorites list?
          </p>

          {/* Actions */}
          <div className="flex w-full flex-col gap-4">
            {/* Remove */}
            <button
              type="button"
              onClick={() => {
                if (target) {
                  confirmRemoveFavorite(target);
                }
              }}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#ffb4ab] px-6 text-[14px] font-bold leading-5 text-[#690005] shadow-sm transition-all duration-200 hover:bg-[#ffdad6] active:scale-95"
            >
              Remove（削除）
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={handleClose}
              className="flex h-12 w-full items-center justify-center rounded-xl border border-[#a48c7a] bg-transparent px-6 text-[14px] font-bold leading-5 text-[#e5e2e1] transition-all duration-200 hover:bg-[#353534]/50 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
