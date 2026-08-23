import { cookies } from "next/headers";
import { HeaderLoggedIn } from "./haeder-logged-in";
import { HeaderLoggedOut } from "./header-logged-out";

/**
 * server component
 * ログイン済みかどうかで、headerコンポーネントの表示を切り替える
 */
export async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (token) {
    return <HeaderLoggedIn />;
  }

  return <HeaderLoggedOut />;
}
