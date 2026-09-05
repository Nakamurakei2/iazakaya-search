"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MdArrowForward, MdLock, MdMail, MdRestaurant } from "react-icons/md";
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
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify(value),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message);
        return;
      }
      const data = await res.json();
      toast.success(data.message);
      router.push("/");
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.name === "TimeoutError" || e.name == "AbortError") {
          console.error("timeout error");
        }
        toast.error(e.message);
      }

      // ネットワークエラーの場合は、TypeErrorを投げるため
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#131313] p-5 text-[#e5e2e1] md:p-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30" />

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md rounded-[24px] border border-[#353534] bg-[#1c1b1b]/60 p-8 shadow-[0px_10px_30px_rgba(255,140,0,0.08)] backdrop-blur-xl md:p-12">
        {/* Logo Header */}
        <div className="mb-12 text-center">
          {/* Icon */}
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff8c00] text-[#623200]">
            <MdRestaurant className="text-4xl" />
          </div>

          {/* Title */}
          <h1 className="mb-2 text-[28px] font-bold leading-9 text-[#e5e2e1] md:text-[40px] md:leading-12">
            Izakaya Finder
          </h1>

          <p className="text-[16px] leading-6 text-[#ddc1ae]">
            Find your glow in the night.
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-bold leading-5 text-[#e5e2e1]"
            >
              Email Address
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#ddc1ae]">
                <MdMail className="text-xl" />
              </div>

              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email", {
                  required: "メールアドレスを入力してください",
                })}
                className="w-full rounded-lg border-0 bg-[#201f1f] py-4 pl-12 pr-4 text-[16px] leading-6 text-[#e5e2e1] placeholder:text-[#ddc1ae]/50 focus:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#ffb77d]"
              />
              <p className="error-message">{errors.email?.message}</p>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1 mt-8">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-bold leading-5 text-[#e5e2e1]"
              >
                Password
              </label>

              {/* <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#ffb77d] transition-colors hover:text-[#ffdcc3]"
              >
                Forgot Password?
              </Link> */}
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#ddc1ae]">
                <MdLock className="text-xl" />
              </div>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "パスワードを入力してください",
                  minLength: {
                    value: 5,
                    message: "パスワードは5文字以上で入力してください",
                  },
                })}
                className="w-full rounded-lg border-0 bg-[#201f1f] py-4 pl-12 pr-4 text-[16px] leading-6 text-[#e5e2e1] placeholder:text-[#ddc1ae]/50 focus:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#ffb77d]"
              />
              <p className="error-message">{errors.password?.message}</p>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff8c00] py-4 text-sm font-bold leading-5 text-[#623200] shadow-lg transition-colors hover:bg-[#ffb77d]"
          >
            <span>Login</span>
            <MdArrowForward className="text-sm" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-[#353534]" />

          {/* <span className="mx-4 text-xs font-semibold text-[#ddc1ae]">
            or continue with
          </span> */}

          <div className="flex-grow border-t border-[#353534]" />
        </div>

        {/* Social Login */}
        {/* <div className="mb-8 grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#353534] bg-[#1c1b1b] px-4 py-4 text-sm font-bold text-[#e5e2e1] transition-colors hover:bg-[#201f1f]"
          >
            <span className="text-base font-bold">G</span>
            Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#353534] bg-[#1c1b1b] px-4 py-4 text-sm font-bold text-[#e5e2e1] transition-colors hover:bg-[#201f1f]"
          >
            <span className="text-base"></span>
            Apple
          </button>
        </div> */}

        {/* Sign Up */}
        <div className="text-center text-[16px] leading-6 text-[#ddc1ae]">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-sm font-bold text-[#ffb77d] transition-colors hover:text-[#ffdcc3]"
          >
            Sign Up
          </Link>
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
