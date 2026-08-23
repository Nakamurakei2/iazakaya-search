import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignupForm from "./signup-form";

// asyncつけてserver component
export default async function SignupPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    // JWTにてトークンを確認する処理を入れる
    redirect("/");
  }

  return <SignupForm />;
}
