import { cookies } from "next/headers";
import IzakayaSearchApp from "./mainForm";
import jwt from "jsonwebtoken";

export default async function MainPage() {
  console.log("server side");
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return <IzakayaSearchApp authorized={false} />;
  }
  let decoded: jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  } catch (e: unknown) {
    return <IzakayaSearchApp authorized={false} />;
  }

  if (decoded) return <IzakayaSearchApp authorized={true} />;
}
