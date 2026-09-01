import { cookies } from "next/headers";
import { NavigationForm } from "./nav-form";
import jwt from "jsonwebtoken";

export const Navigation = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_token")?.value;

  if (userId) {
    const decoded = jwt.verify(userId, process.env.JWT_SECRET!);

    if (decoded) {
      return <NavigationForm />;
    }
  }
};
