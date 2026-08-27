"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

// ---------------------------------------------------------------------------
// お問い合わせ種別
// ---------------------------------------------------------------------------
const INQUIRY_TYPES = [
  "予約についてのお問い合わせ",
  "掲載・タイアップについて",
  "不具合のご報告",
  "その他のお問い合わせ",
] as const;

const MESSAGE_MAX_LENGTH = 1000;

type FormState = {
  name: string;
  email: string;
  phone: string;
  type: string;
  subject: string;
  message: string;
  agree: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  type: "",
  subject: "",
  message: "",
  agree: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const remaining = useMemo(
    () => MESSAGE_MAX_LENGTH - form.message.length,
    [form.message],
  );

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // 入力し直したタイミングでそのフィールドのエラーは消す
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "お名前を入力してください";
    if (!form.email.trim()) {
      next.email = "メールアドレスを入力してください";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      next.email = "メールアドレスの形式が正しくありません";
    }
    if (!form.type) next.type = "お問い合わせ種別を選択してください";
    if (!form.subject.trim()) next.subject = "件名を入力してください";
    if (!form.message.trim()) {
      next.message = "お問い合わせ内容を入力してください";
    } else if (form.message.length > MESSAGE_MAX_LENGTH) {
      next.message = `内容は${MESSAGE_MAX_LENGTH}文字以内で入力してください`;
    }
    if (!form.agree) next.agree = "プライバシーポリシーへの同意が必要です";
    return next;
  };

  /**
   * 問い合わせAPI
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const testData = {
      test: "message",
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
        // signal:
      });
      const data = await res.json();
      if (!res.ok) {
        // fail対応
      }
      console.log("data", data);

      setIsSubmitted(true);
    } catch {
      setErrors({
        message: "送信に失敗しました。時間をおいて再度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="page">
        <div className="ambient-glow" aria-hidden="true" />
        <header className="header">
          <div className="brand-row">
            <span className="lantern-dot" aria-hidden="true" />
            <h1 className="brand-title">お問い合わせ</h1>
          </div>
          <p className="brand-sub">送信内容を確認いたします</p>
        </header>

        <section className="contact-card success-card">
          <div className="success-icon-wrap">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="success-title">お問い合わせを受け付けました</h2>
          <p className="success-body">
            ご入力いただいたメールアドレス宛に確認メールをお送りしています。
            内容を確認のうえ、担当より折り返しご連絡いたします。
          </p>

          <div className="success-actions">
            <button type="button" className="ghost-btn" onClick={handleReset}>
              別のお問い合わせを送る
            </button>
            <Link href="/" className="submit-btn success-link">
              <ArrowLeft size={16} />
              トップに戻る
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="ambient-glow" aria-hidden="true" />

      <header className="header">
        <div className="brand-row">
          <span className="lantern-dot" aria-hidden="true" />
          <h1 className="brand-title">お問い合わせ</h1>
        </div>
        <p className="brand-sub">
          サイトのご意見などございましたらご気軽にどうぞ
        </p>
      </header>

      <form className="contact-card" onSubmit={handleSubmit} noValidate>
        {/* お名前 */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            お名前
            <span className="required-badge">必須</span>
          </label>
          <div
            className={`field-wrap ${errors.name ? "field-wrap--error" : ""}`}
          >
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="山田 太郎"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </div>
          {errors.name && (
            <p id="name-error" className="error-message">
              <AlertCircle size={12} />
              {errors.name}
            </p>
          )}
        </div>

        {/* メールアドレス / 電話番号 */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              メールアドレス
              <span className="required-badge">必須</span>
            </label>
            <div
              className={`field-wrap ${errors.email ? "field-wrap--error" : ""}`}
            >
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="example@example.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="error-message">
                <AlertCircle size={12} />
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="phone"
              className="form-label"
              style={{ marginTop: "18px" }}
            >
              電話番号
              <span className="optional-badge">任意</span>
            </label>
            <div className="field-wrap">
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="090-1234-5678"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* お問い合わせ種別 */}
        <div className="form-group">
          <label htmlFor="type" className="form-label">
            お問い合わせ種別
            <span className="required-badge">必須</span>
          </label>
          <div
            className={`select-wrap ${errors.type ? "field-wrap--error" : ""}`}
          >
            <select
              id="type"
              className="form-select"
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
              aria-invalid={!!errors.type}
              aria-describedby={errors.type ? "type-error" : undefined}
            >
              <option value="" disabled>
                選択してください
              </option>
              {INQUIRY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {errors.type && (
            <p id="type-error" className="error-message">
              <AlertCircle size={12} />
              {errors.type}
            </p>
          )}
        </div>

        {/* 件名 */}
        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            件名
            <span className="required-badge">必須</span>
          </label>
          <div
            className={`field-wrap ${errors.subject ? "field-wrap--error" : ""}`}
          >
            <input
              id="subject"
              type="text"
              className="form-input"
              placeholder="件名を入力してください"
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
          </div>
          {errors.subject && (
            <p id="subject-error" className="error-message">
              <AlertCircle size={12} />
              {errors.subject}
            </p>
          )}
        </div>

        {/* お問い合わせ内容 */}
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            お問い合わせ内容
            <span className="required-badge">必須</span>
          </label>
          <div
            className={`field-wrap field-wrap--textarea ${
              errors.message ? "field-wrap--error" : ""
            }`}
          >
            <textarea
              id="message"
              className="form-textarea"
              placeholder="お問い合わせ内容を具体的にご記入ください"
              rows={6}
              maxLength={MESSAGE_MAX_LENGTH}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={
                errors.message ? "message-error" : "message-count"
              }
            />
          </div>
          <div className="field-footer">
            {errors.message ? (
              <p id="message-error" className="error-message">
                <AlertCircle size={12} />
                {errors.message}
              </p>
            ) : (
              ""
            )}
            <span id="message-count" className="char-count">
              {form.message.length} / {MESSAGE_MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* プライバシーポリシー同意 */}
        <div className="form-group">
          <label
            className={`checkbox-row ${errors.agree ? "checkbox-row--error" : ""}`}
          >
            <input
              type="checkbox"
              className="checkbox-input"
              checked={form.agree}
              onChange={(e) => updateField("agree", e.target.checked)}
            />
            <span className="checkbox-box" aria-hidden="true" />
            <span className="checkbox-label">
              <Link href="/privacy" className="inline-link">
                プライバシーポリシー
              </Link>
              に同意する
            </span>
          </label>
          {errors.agree && (
            <p className="error-message">
              <AlertCircle size={12} />
              {errors.agree}
            </p>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 size={16} className="spin" />
          ) : (
            <Send size={16} />
          )}
          <span>{isSubmitting ? "送信中…" : "送信する"}</span>
        </button>
      </form>
    </div>
  );
}
