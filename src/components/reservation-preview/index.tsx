type Props = {
  station: string | undefined;
  people: number;
  date: string;
  time: string;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ReservationPreview = (props: Props) => {
  const { station, people, date, time, setShowConfirm } = props;
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <p className="eyebrow">Reservation Preview</p>
        <h2 id="confirm-title">予約リクエスト確認</h2>
        <p>
          {station}で{people}名、{date} {time}
          開始の二軒ルートを送信する想定の確認画面です。
        </p>
        <div className="modal-actions">
          <button
            className="ghost-button"
            onClick={() => setShowConfirm(false)}
            type="button"
          >
            戻る
          </button>
          <button
            className="primary-button"
            onClick={() => setShowConfirm(false)}
            type="button"
          >
            送信UIを確認
          </button>
        </div>
      </section>
    </div>
  );
};
