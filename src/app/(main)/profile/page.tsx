import { cookies } from "next/headers";
import ProfileFormPage from "./profile-form";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/pool";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    console.error("認証情報が不正です");
    return <ProfileFormPage authenticate={false} />;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decoded) {
    console.error("認証情報が不正です");
    return <ProfileFormPage authenticate={false} />;
  }
  let username = "";
  let useremail = "";

  try {
    const userId = decoded.sub;
    const result = await pool.query(
      `
      SELECT name, email
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    console.log("result", result);
    username = result.rows[0].name;
    useremail = result.rows[0].email;
  } catch (e: unknown) {
    console.error("e", e);
  }

  // メールアドレスと名前が欲しい
  return (
    <ProfileFormPage name={username} email={useremail} authenticate={true} />
  );
}
