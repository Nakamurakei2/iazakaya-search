import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * メール送信API
 * @param req 問い合わせ内容
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, type, subject, message } = await req.json();
    // SMTPサーバーの設定
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // 修正：不要な「://」を削除し、頭に「smtp.」を追加
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER, // あなたのGmailアドレス
        pass: process.env.MAIL_PASS, // Googleで発行したアプリパスワード
      },
    });

    // メールの内容を設定
    const mailOptions = {
      from: `"${name}" <${email}>`, // 送信元（ユーザー情報）
      to: process.env.MAIL_USER, // 🌟 あなたのメールアドレス（通知先）
      subject: `【お問い合わせ】${subject}`,
      text: `
        お名前: ${name}
        メールアドレス: ${email}
        電話番号: ${phone}
        お問い合わせ種別: ${type}

        【本文】
        ${message}
      `,
    };

    // 送信実行
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "メールを送信しました。" },
      { status: 200 },
    );
  } catch (e: unknown) {
    console.error("e", e);
    return NextResponse.json(
      { message: "送信に失敗しました。" },
      { status: 500 },
    );
  }
}
