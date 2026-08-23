import { Izakayas, Venue } from "@/types/restaurant";

export const formatVenue = (izakaya: Izakayas): Venue => ({
  name: izakaya.name,
  area: izakaya.address,
  walk: izakaya.access,
  genre: {
    name: izakaya.genre.name,
  },
  price: izakaya.budget.average,
  tags: [
    izakaya.free_drink === "あり" ? "飲み放題" : null,
    izakaya.free_food === "あり" ? "食べ放題" : null,
    izakaya.non_smoking === "あり" ? "禁煙" : "喫煙可",
    izakaya.charter === "あり" ? "貸切可" : null,
  ].filter(Boolean) as string[],
  highlight:
    izakaya.shop_detail_memo ||
    izakaya.budget_memo ||
    "詳細情報をご確認ください。",
  status: "available",
  distance: izakaya.distance,
  catch: izakaya.catch,
});
