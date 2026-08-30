"use client";

import ContactConfirmPage from "@/components/confirm/confirm";
import ContactFormPage, { FormState } from "@/components/contact/contact";
import { useState } from "react";

export const confirmInputInitData = {
  name: "",
  email: "",
  phone: "",
  type: "",
  subject: "",
  message: "",
};

export default function ContactFormRootPage() {
  const [isEntered, setIsEntered] = useState(false); // 問い合わせページに入力済みかどうか
  const [inputData, setInputData] = useState<FormState>(confirmInputInitData); // 問い合わせ内容情報

  return (
    <>
      {isEntered ? (
        <ContactConfirmPage setIsEntered={setIsEntered} inputData={inputData} />
      ) : (
        <ContactFormPage
          setIsEntered={setIsEntered}
          inputData={inputData}
          setInputData={setInputData}
        />
      )}
    </>
  );
}
