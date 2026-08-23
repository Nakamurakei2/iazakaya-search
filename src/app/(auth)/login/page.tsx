import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

// server Component(Cookieを確認)
export default async function LoginPage() {
  const cookieStore = await cookies();
  console.log("cookiestore", cookieStore);
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    redirect("/");
  }

  return <LoginForm />;
}
