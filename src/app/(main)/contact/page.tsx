import { cookies } from "next/headers";
import ContactFormRootPage from "./contact-form";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

// server component
export default async function ContactPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // トークンがない場合はルートディレクトリに遷移
  if (!token) {
    redirect("/");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded && decoded.sub) {
      <ContactFormRootPage />;
    }
  } catch (e: unknown) {
    console.error(e);
  }

  redirect("/");
}
