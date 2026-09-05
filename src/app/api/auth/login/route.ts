import { pool } from "@/lib/pool";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const query = `
      SELECT id, password FROM users 
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "メールアドレス、またはパスワードが異なります。" },
        { status: 401 },
      );
    }

    const user = result.rows[0];
    // パスワード照合
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "メールアドレス、またはパスワードが異なります。" },
        { status: 401 },
      );
    }

    // JWT発行
    const token = jwt.sign(
      {
        sub: String(user.id),
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    // Cookieに保存
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true, // セキュリティ対策（JSからのアクセス禁止）
      secure: process.env.NODE_ENV === "production", // 本番環境のみ送信
      sameSite: "lax", // CSR対策
      maxAge: 60 * 60 * 24 * 7, // 有効期限（ここでは一週間）
      path: "/",
    });

    return NextResponse.json(
      { message: "ログインに成功しました。" },
      { status: 200 },
    );
  } catch (e: unknown) {
    console.error("unexpected error", e);
    return NextResponse.json({ message: "unexpected error" }, { status: 500 });
  }
}
