import { cookies } from "next/headers";
import ConciergeForm from "./concierge";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function ConciergePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/");
  }

  let decoded: jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  } catch (e: unknown) {
    // 期限切れや改ざんなど、検証に失敗した場合
    console.error("ログイン画面でのJWT検証失敗（スルーして画面を表示）:", e);
    redirect("/");
  }
  if (decoded) {
    return <ConciergeForm />;
  }
}
