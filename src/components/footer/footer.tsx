import { cookies } from "next/headers";
import FooterLoggedIn from "./footer-logged-in";

export async function Footer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (token) {
    return <FooterLoggedIn />;
  }
}
