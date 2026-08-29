"use client";

import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  // ログイン処理
  const onSubmit = async (value: LoginFormValues) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      router.push("/");
    } catch (e: unknown) {
      console.error("unexpected error", e);
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        {/* <div className="auth__logo">
          <span className="auth__logoDot" />
          <span className="auth__logoText">Beacon</span>
        </div> */}

        <div className="auth__tabs">
          <Link href="/login" className="auth__tab auth__tab--active">
            ログイン
          </Link>
          <Link href="/signup" className="auth__tab">
            新規登録
          </Link>
        </div>

        <form className="auth__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="login-email">
              メールアドレス
            </label>
            <div className="auth__inputWrap">
              <Mail size={16} strokeWidth={1.75} className="auth__inputIcon" />
              <input
                id="login-email"
                type="email"
                className="auth__input"
                placeholder="you@example.com"
                {...register("email", {
                  required: "メールアドレスを入力してください",
                })}
              />
            </div>
            <p className="error-message">{errors.email?.message}</p>
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="login-password">
              パスワード
            </label>
            <div className="auth__inputWrap">
              <Lock size={16} strokeWidth={1.75} className="auth__inputIcon" />
              <input
                id="login-password"
                type="password"
                className="auth__input"
                placeholder="5文字以上"
                {...register("password", {
                  required: "パスワードを入力してください",
                  minLength: {
                    value: 5,
                    message: "パスワードは5文字以上で入力してください",
                  },
                })}
              />
            </div>
            <p className="error-message">{errors.password?.message}</p>
          </div>

          {/* <a href="#forgot-password" className="auth__forgotLink">
                パスワードをお忘れですか？
              </a> */}

          <button
            type="submit"
            className="auth__submit"
            disabled={isSubmitting}
          >
            ログイン
          </button>
        </form>

        <p className="auth__switchText">
          アカウントをお持ちでない方は
          <Link href="/signup" className="auth__switchLink">
            新規登録
          </Link>
        </p>

        <p className="auth__switchText">
          <Link href="/" className="auth__switchLink">
            ログインせずに利用する場合はこちらから
          </Link>
        </p>
      </div>
    </div>
  );
}
