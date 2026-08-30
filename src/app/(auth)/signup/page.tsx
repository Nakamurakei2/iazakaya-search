import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import SignupForm from "./signup-form";

export default async function SignupPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // 1. トークンがなければ、未ログインなのでそのままサインアップ画面を表示
  if (!token) {
    return <SignupForm />;
  }

  let decoded: jwt.JwtPayload;

  // 2. トークンがある場合は、有効なものか検証する
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  } catch (e: unknown) {
    // 期限切れや改ざんなど、検証に失敗した場合
    console.error(
      "サインアップ画面でのJWT検証失敗（スルーして画面を表示）:",
      e,
    );

    return <SignupForm />;
  }

  if (decoded) {
    redirect("/");
  }

  // トークンが不正だった場合は、ここへ流れて画面が表示される
  return <SignupForm />;
}
