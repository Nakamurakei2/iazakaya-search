import { cookies } from "next/headers";
import ContactFormRootPage from "./contact-form";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

// server component
export default async function ContactPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // トークンがない場合はルートディレクトリに遷移(Cookie削除する必要あり)
  if (!token) {
    redirect("/");
  }
  let decoded: jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  } catch (e: unknown) {
    console.error(e);
    redirect("/");
  }
  if (decoded) {
    return <ContactFormRootPage />;
  }
  redirect("/");
}
