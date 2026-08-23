import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * ログアウトAPI
 */
export async function DELETE() {
  const cookieStore = await cookies();
  // Cookieの存在確認
  const hasToken = cookieStore.has("auth_token");

  if (!hasToken) {
    return NextResponse.json(
      { message: "すでにログアウト状態か、セッションが存在しません。" },
      {
        status: 400,
      },
    );
  }

  // Cookieを削除
  cookieStore.delete("auth_token");
  return NextResponse.json(
    { message: "正常にログアウトしました" },
    { status: 200 },
  );
}
