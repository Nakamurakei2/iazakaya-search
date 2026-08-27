import { pool } from "@/lib/pool";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const query = `
      SELECT id FROM users 
      WHERE email = $1 AND password = $2
    `;
    const result = await pool.query(query, [email, password]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "メールアドレス、またはパスワードが異なります。" },
        { status: 401 },
      );
    }
    const token = result.rows[0].id; // jwtなどで署名する
    // Cookieを管理するオブジェクトを取得
    const cookieStore = await cookies();

    // Cookieのセッション作成
    cookieStore.set("auth_token", token, {
      httpOnly: true, // セキュリティ対策（JSからのアクセス禁止）
      secure: process.env.NODE_ENV === "production", // 本番環境のみ送信
      sameSite: "lax", // CSR対策
      maxAge: 60 * 60 * 24 * 7, // 有効期限（ここでは一週間）
      path: "/",
    });

    return NextResponse.json(
      { message: "ユーザーログインに成功しました。" },
      { status: 200 },
    );
  } catch (e: unknown) {
    console.error("unexpected error", e);
    return NextResponse.json({ message: "unexpected error" }, { status: 500 });
  }
}
