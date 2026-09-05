"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { MdRestaurant } from "react-icons/md";

type SignupFormValues = {
  username: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>();

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        // エラーメッセージ表示
        if (res.status === 409) {
          const data = await res.json();

          toast.error(data.message);
        } else {
          // 他にもあれば
        }
        return;
      }
      const data = await res.json();

      // 成功メッセージ表示
      toast.success(data.message);
      router.push("/");
    } catch (e: unknown) {
      if (e instanceof TypeError) {
        console.error("ネットワークエラーが発生しました:", e.message);
        // ユーザーへの通知: "インターネットに接続されていません。回線状況を確認してください。"
        toast.error(
          "インターネットに接続されていません。回線状況を確認してください。",
        );
        return;
      }

      console.error("予期せぬエラー", e);
      toast.error(
        "予期せぬエラーが発生しました。時間を押してから再度実行してください",
      );
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#131313] px-5 py-12 text-[#e5e2e1]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,0,0.15)_0%,transparent_60%),radial-gradient(circle_at_bottom_left,rgba(255,140,0,0.05)_0%,transparent_50%)]" />

      <div className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-20" />

      {/* Main */}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col justify-center">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff8c00] text-[#623200]">
            <MdRestaurant className="text-4xl" />
          </div>

          <h1 className="mb-2 text-[28px] font-bold leading-9 text-[#e5e2e1] md:text-[40px] md:leading-[48px]">
            Create your account
          </h1>

          <p className="text-[16px] leading-6 text-[#ddc1ae]">
            Join Izakaya Finder and discover the night.
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full rounded-[24px] border border-[#353534]/50 bg-[#353534]/80 p-6 shadow-[0_10px_30px_rgba(255,140,0,0.08)] backdrop-blur-xl md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="mt-8">
              <label
                htmlFor="fullName"
                className="mb-2 block text-[14px] font-bold leading-5 text-[#e5e2e1]"
              >
                User Name
              </label>

              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ddc1ae]" />

                <input
                  id="username"
                  type="text"
                  placeholder="Taro Yamada"
                  className="w-full rounded-lg border border-[#564334] bg-[#1c1b1b] py-3 pl-12 pr-4 text-[16px] leading-6 text-[#e5e2e1] outline-none transition-colors placeholder:text-[#ddc1ae]/50 focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d]"
                  {...register("username", {
                    required: "お名前を入力してください",
                  })}
                />
                <p className="error-message">{errors.username?.message}</p>
              </div>
            </div>

            {/* Email */}
            <div className="mt-8">
              <label
                htmlFor="email"
                className="mb-2 block text-[14px] font-bold leading-5 text-[#e5e2e1]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ddc1ae]" />

                <input
                  id="email"
                  type="email"
                  placeholder="taro@example.com"
                  className="w-full rounded-lg border border-[#564334] bg-[#1c1b1b] py-3 pl-12 pr-4 text-[16px] leading-6 text-[#e5e2e1] outline-none transition-colors placeholder:text-[#ddc1ae]/50 focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d]"
                  {...register("email", {
                    required: "メールアドレスを入力してください",
                  })}
                />
                <p className="error-message">{errors.email?.message}</p>
              </div>
            </div>

            {/* Password */}
            <div className="mt-8">
              <label
                htmlFor="password"
                className="mb-2 block text-[14px] font-bold leading-5 text-[#e5e2e1]"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ddc1ae]" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#564334] bg-[#1c1b1b] py-3 pl-12 pr-12 text-[16px] leading-6 text-[#e5e2e1] outline-none transition-colors placeholder:text-[#ddc1ae]/50 focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d]"
                  {...register("password", {
                    required: "パスワードを入力してください",
                    minLength: {
                      value: 5,
                      message: "パスワードは5文字以上で入力してください",
                    },
                  })}
                />
                <p className="error-message">{errors.password?.message}</p>

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "パスワードを隠す" : "パスワードを表示"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ddc1ae] transition-colors hover:text-[#ffb77d]"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff8c00] px-4 py-3 text-[18px] font-bold leading-7 text-[#623200] shadow-lg transition-colors duration-300 hover:bg-[#ffdcc3] active:scale-[0.98]"
            >
              Create Account
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Login */}
        <div className="mt-8 text-center text-[16px] leading-6 text-[#ddc1ae]">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-bold text-[#ffb77d] underline-offset-4 transition-colors hover:text-[#ffdcc3] hover:underline"
          >
            Login here
          </a>
        </div>
        <br />
        <div className="text-center text-[16px] leading-6 text-[#ddc1ae]">
          You can use this app without an account.
          <Link
            href="/"
            className="text-sm font-bold text-[#ffb77d] transition-colors hover:text-[#ffdcc3]"
          >
            {" "}
            Access from here.
          </Link>
        </div>
      </div>
    </div>
  );
}
