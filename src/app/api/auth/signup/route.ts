import { pool } from "@/lib/pool";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface DatabaseError extends Error {
  code: string;
}

// 型ガード関数
function isDatabaseError(error: unknown): error is DatabaseError {
  return typeof error === "object" && error != null && "code" in error;
}

/**
 * ユーザー登録API
 * @param request
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 12);
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;
    const result = await pool.query(query, [username, email, hashedPassword]);
    const user = result.rows[0];

    // JWT発行
    const token = jwt.sign(
      {
        sub: String(user.id),
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    // Cookie登録
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true, // セキュリティ対策（JSからのアクセス禁止）
      secure: process.env.NODE_ENV === "production", // 本番環境のみ送信
      sameSite: "lax", // CSR対策
      maxAge: 60 * 60 * 24 * 7, // 有効期限（ここでは一週間）
      path: "/",
    });

    return NextResponse.json(
      { message: "ユーザー登録に成功しました", name: result.rows[0].name },
      { status: 201 },
    );
  } catch (e: unknown) {
    console.error("error occured", e);

    if (isDatabaseError(e)) {
      // Database重複エラー
      if (e.code === "23505") {
        return NextResponse.json(
          {
            message: "このメールアドレスはすでに登録されています。",
            detail: "データベース重複エラー",
          },
          { status: 409 },
        );
      }
    }
    throw new Error("unexpected error occured");
  }
}
