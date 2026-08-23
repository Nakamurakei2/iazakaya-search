import { AlertCircle, Loader2, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface ErrorModalProps {
  isError?: boolean;
  title?: string;
  message: string;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function ErrorModal({
  isError = true,
  title = "エラーが発生しました",
  message = "処理を完了できませんでした。時間をおいて再度お試しください。",
  setIsModalOpen,
}: ErrorModalProps) {
  // 「閉じる」ボタン押下時処理
  const onClose = () => {
    if (setIsModalOpen) setIsModalOpen(false);
  };

  return (
    <div className="errorModal__overlay">
      <div
        className="errorModal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-message"
      >
        {setIsModalOpen && (
          <button
            type="button"
            className="errorModal__closeButton"
            onClick={onClose}
            aria-label="閉じる"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        )}

        {isError ? (
          <div className="errorModal__iconWrap">
            <AlertCircle
              size={28}
              strokeWidth={1.75}
              className="errorModal__icon"
            />
          </div>
        ) : (
          <div className="loadingModal__iconWrap">
            <Loader2
              size={28}
              strokeWidth={1.75}
              className="loadingModal__icon loadingModal__icon--spin" // 🌟 回転用のクラスを付与
            />
          </div>
        )}

        <h2 id="error-modal-title" className="errorModal__title">
          {title}
        </h2>
        <p id="error-modal-message" className="errorModal__message">
          {message}
        </p>

        {setIsModalOpen && (
          <div className="errorModal__actions">
            <button
              type="button"
              className="errorModal__secondaryButton"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
