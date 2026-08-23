type Props = {
  people: number;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BatchBooking = (props: Props) => {
  const { setShowConfirm } = props;

  return (
    <aside className="search-panel" aria-label="検索条件">
      <div className="booking-head">
        <p className="eyebrow">Batch Booking</p>
        <h2>一括予約</h2>
      </div>
      <div className="timeline">
        <div>
          <span>19:00</span>
          {/* <strong>{currentPlan.first.name}</strong> */}
          <p>{/* {people}名 / {currentPlan.first.genre} */}</p>
        </div>
        <div>
          <span>21:20</span>
          {/* <strong>{currentPlan.second.name}</strong> */}
          <p>{/* {people}名 / {currentPlan.second.genre} */}</p>
        </div>
      </div>

      <div className="request-box">
        <label htmlFor="request">お店への要望</label>
        <textarea
          id="request"
          placeholder="例: 端の席希望、アレルギーあり、二軒目は静かな席希望"
          rows={5}
        />
      </div>

      <div className="price-box">
        <span>合計目安</span>
        {/* <strong>{currentPlan.total}</strong> */}
        <small>席料・サービス料はAPI連携時に反映</small>
      </div>

      <button
        className="primary-button"
        onClick={() => setShowConfirm(true)}
        type="button"
      >
        この2軒をまとめて予約
      </button>
    </aside>
  );
};
