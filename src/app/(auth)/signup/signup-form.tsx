"use client";

import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SignupFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>();

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // signal:
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        // エラーメッセージ表示
        if (res.status === 409) {
          toast.error(data.message);
        } else {
          // 他にもあれば
        }
        return;
      }
      // 成功メッセージ表示
      toast.success(data.message);
      router.push("/");
    } catch (e: unknown) {
      console.error("error occured", e);
    }
  };

  return (
    <div>
      <div className="auth">
        <div className="auth__card">
          <div className="auth__tabs">
            <Link href="/login" className="auth__tab">
              ログイン
            </Link>
            <Link href="/signup" className="auth__tab auth__tab--active">
              新規登録
            </Link>
          </div>

          <form className="auth__form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth__field">
              <label className="auth__label" htmlFor="signup-name">
                お名前
              </label>
              <div className="auth__inputWrap">
                <User
                  size={16}
                  strokeWidth={1.75}
                  className="auth__inputIcon"
                />
                <input
                  id="signup-name"
                  type="text"
                  className="auth__input"
                  placeholder="山田 太郎"
                  {...register("username", {
                    required: "お名前を入力してください",
                  })}
                />
              </div>
              <p className="error-message">{errors.username?.message}</p>
            </div>

            <div className="auth__field">
              <label className="auth__label" htmlFor="signup-email">
                メールアドレス
              </label>
              <div className="auth__inputWrap">
                <Mail
                  size={16}
                  strokeWidth={1.75}
                  className="auth__inputIcon"
                />
                <input
                  id="signup-email"
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
              <label className="auth__label" htmlFor="signup-password">
                パスワード
              </label>
              <div className="auth__inputWrap">
                <Lock
                  size={16}
                  strokeWidth={1.75}
                  className="auth__inputIcon"
                />
                <input
                  id="signup-password"
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

            <div className="auth__field">
              <label className="auth__label" htmlFor="signup-password-confirm">
                パスワード（確認）
              </label>
              <div className="auth__inputWrap">
                <Lock
                  size={16}
                  strokeWidth={1.75}
                  className="auth__inputIcon"
                />
                <input
                  id="signup-password-confirm"
                  type="password"
                  className="auth__input"
                  placeholder="もう一度入力してください"
                  {...register("confirmPassword", {
                    required: "確認用パスワードを入力してください",
                    minLength: {
                      value: 5,
                      message: "パスワードは5文字以上で入力してください",
                    },
                  })}
                />
              </div>
              <p className="error-message">{errors.confirmPassword?.message}</p>
            </div>

            <button
              type="submit"
              className="auth__submit"
              disabled={isSubmitting}
            >
              アカウントを作成
            </button>
          </form>

          <p className="auth__switchText">
            すでにアカウントをお持ちの方は
            <Link href="/login" className="auth__switchLink">
              ログイン
            </Link>
          </p>

          <p className="auth__switchText">
            <Link href="/" className="auth__switchLink">
              登録せずに利用する場合はこちらから
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
