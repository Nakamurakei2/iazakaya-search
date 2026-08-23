import { pool } from "@/lib/pool";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface DatabaseError extends Error {
  code: string
}

// 型ガード関数
function isDatabaseError(error: unknown): error is DatabaseError  {
  return (typeof error === 'object' && error != null && 'code' in error)
}

/**
 * ユーザー登録API
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
  try {
    const {username, email, password} = await request.json();
    const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email
    `;
    const result = await pool.query(query, [username, email, password]);
    const token = result.rows[0].id; // jwtなどで署名する
    // Cookieを管理するオブジェクトを取得
    const cookieStore = await cookies();

    // set Cookie
    cookieStore.set('auth_token', token, {
      httpOnly: true, // セキュリティ対策（JSからのアクセス禁止）
      secure: process.env.NODE_ENV === 'production', // 本番環境のみ送信
      sameSite: 'lax', // CSR対策
      maxAge: 60*60*24*7, // 有効期限（ここでは一週間）
      path: '/',
    });
    
    return NextResponse.json({message: 'ユーザー登録に成功しました', name: result.rows[0].name}, {status: 201})
  } catch(e: unknown) {
    console.error('error occured', e);

    if(isDatabaseError(e)) {
      // Database重複エラー
      if(e.code === '23505') {
        return NextResponse.json({
          message: 'このメールアドレスはすでに登録されています。',
          detail:'データベース重複エラー'
        }, {status: 409})
      }
    }
    throw new Error("unexpected error occured");
  }
}