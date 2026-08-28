"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Loader2 } from "lucide-react";
import { FormState } from "../contact/contact";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ConfirmFieldProps = {
  label: string;
  value: string;
  multiline?: boolean;
};

function ConfirmField({ label, value, multiline }: ConfirmFieldProps) {
  return (
    <div className="confirm-field">
      <p className="confirm-field-label">{label}</p>
      <div
        className={`confirm-field-value ${
          multiline ? "confirm-field-value--multiline" : ""
        }`}
      >
        <span>{value || "（未入力）"}</span>
      </div>
    </div>
  );
}

type Props = {
  setIsEntered: Dispatch<SetStateAction<boolean>>;
  inputData: FormState;
  setInputData: Dispatch<SetStateAction<FormState>>;
};

export default function ContactConfirmPage(props: Props) {
  const router = useRouter();

  const { setIsEntered, inputData, setInputData } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 「内容を修正する」ボタン押下時処理
   */
  const handleBack = () => {
    setIsEntered(false);
  };

  /**
   * 「この内容で送信する」ボタン押下時処理
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // メール送信処理
      const res = await fetch(`/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // signal
        body: JSON.stringify(inputData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      router.push("/contact");
    } catch (e: unknown) {
      console.error("e", e);
    } finally {
      setIsSubmitting(false);
    }

    console.log("submit contact");
  };

  return (
    <div className="page">
      <div className="ambient-glow" aria-hidden="true" />

      <header className="header">
        <div className="brand-row">
          <span className="lantern-dot" aria-hidden="true" />
          <h1 className="brand-title">お問い合わせ内容の確認</h1>
        </div>
        <p className="brand-sub">
          下記の内容でよろしければ、そのまま送信してください
        </p>
      </header>

      {/* 入力内容（読み取り専用） */}
      <section className="contact-card confirm-card">
        <ConfirmField label="お名前" value={inputData.name} />
        <ConfirmField label="メールアドレス" value={inputData.email} />
        <ConfirmField label="電話番号" value={inputData.phone} />
        <ConfirmField label="お問い合わせ種別" value={inputData.type} />
        <ConfirmField label="件名" value={inputData.subject} />
        <ConfirmField
          label="お問い合わせ内容"
          value={inputData.message}
          multiline
        />
      </section>

      <p className="confirm-note">
        送信後、担当より内容確認のご連絡をいたします。内容を修正したい場合は「内容を修正する」から入力画面に戻れます。
      </p>

      {/* アクション */}
      <div className="confirm-action-row">
        <button
          type="button"
          className="ghost-btn confirm-back-btn"
          onClick={handleBack}
          disabled={isSubmitting}
          style={{ color: "#202124", fontWeight: 400 }}
        >
          内容を修正する
        </button>
        <button
          type="button"
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 size={16} className="spin" /> : ""}
          <span>{isSubmitting ? "送信中…" : "この内容で送信する"}</span>
        </button>
      </div>
    </div>
  );
}
