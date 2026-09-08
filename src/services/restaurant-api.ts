import { AddFavoritesButtonProps } from "@/types/restaurant";
import { toast } from "sonner";

/**
 * お気に入り登録ボタン押下時処理
 * @returns レストランのid
 */
export const handleAddFavoritesButtonClick = async (
  props: AddFavoritesButtonProps,
): Promise<string | undefined> => {
  const { restaurantId } = props;

  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ restaurantId }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const data = await res.json();

      toast.error(data.message);
      return;
    }
    const data = await res.json();
    toast.success(data.message);

    return data.restaurant_id;
  } catch (e: unknown) {
    console.error("e", e);

    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};

/**
 * お気に入り解除ボタン押下時処理
 */
export const handleDeleteFavoritesButton = async (
  props: AddFavoritesButtonProps,
) => {
  const { restaurantId } = props;

  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ restaurantId }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message);
      return;
    }
    const data = await res.json();
    toast.success(data.message);

    // return data.restaurant_id;
  } catch (e: unknown) {
    console.error("e", e);

    if (e instanceof Error) {
      toast.error(e.message);
    }
  }
};
