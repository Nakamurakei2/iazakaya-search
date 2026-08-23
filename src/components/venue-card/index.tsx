import { Venue } from "@/types/restaurant";

type Props = {
  order: string;
  venue: Venue;
  onClick?: () => void;
};

const statusLabels = {
  available: "即予約",
  limited: "残席少",
  request: "リクエスト",
};

export const VenueCard = ({ order, venue, onClick }: Props) => {
  return (
    <article className="venue-card" onClick={onClick}>
      <div className="venue-head">
        <span>{order}</span>
        <em className={`status ${venue.status}`}>
          {statusLabels[venue.status]}
        </em>
      </div>
      <h3>{venue.name}</h3>
      <dl>
        <div>
          <dt>エリア</dt>
          <dd>
            {venue.area} / {venue.walk} <br />
          </dd>
          <dt>直線距離</dt>
          {venue.distance && `現在地から約${venue.distance.toLocaleString()}m`}
        </div>
        <div>
          <dt>ジャンル</dt>
          <dd>{venue.genre.name}</dd>
          <dd>{venue.catch}</dd>
        </div>
        <div>
          <dt>目安</dt>
          <dd>{venue.price}</dd>
        </div>
      </dl>
      <div className="tag-row">
        {venue.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
};
