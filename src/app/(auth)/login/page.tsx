import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import jwt from "jsonwebtoken";

// server Component(Cookieを確認)
export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return <LoginForm />;
  }

  let decoded: jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  } catch (e: unknown) {
    // 期限切れや改ざんなど、検証に失敗した場合
    console.error("ログイン画面でのJWT検証失敗（スルーして画面を表示）:", e);
    return <LoginForm />;
  }
  if (decoded) {
    redirect("/");
  }

  return <LoginForm />;
}
