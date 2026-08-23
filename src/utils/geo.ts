type DistanceCalcProps = BaseProps & (InputValue | CurrentLocation);

type BaseProps = {
  // お店の緯度・経度 [[lat, lng], [lat, lng], ...]
  points: number[][];
};

type InputValue = {
  // 入力値(例：新宿駅)
  station: string;
  // 現在の緯度
  latitude?: never;
  // 現在の経度
  longitude?: never;
};

type CurrentLocation = {
  // 入力値(例：新宿駅)
  station?: never;
  // 現在の緯度
  latitude: number;
  // 現在の経度
  longitude: number;
};

// 内部で使用する直線距離計算のヘルパー関数（半正矢の公式）
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371000; // 地球の半径 (メートル)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // 四捨五入して整数（メートル）で返す
};

// 💡 【実務レベルの仕組み】主要な駅の座標をあらかじめマッピングしておく辞書
// APIの通信を減らして爆速で動かすためのフロントエンドのモックデータ（キャッシュ）の手法です
const STATION_COORDINATES_MAP: Record<string, { lat: number; lng: number }> = {
  新宿駅: { lat: 35.6895, lng: 139.6917 },
  渋谷駅: { lat: 35.658, lng: 139.7016 },
  池袋駅: { lat: 35.7289, lng: 139.7104 },
  東京駅: { lat: 35.6812, lng: 139.7671 },
  横浜駅: { lat: 35.4658, lng: 139.6223 },
};

export const distanceCalculation = (props: DistanceCalcProps): number[] => {
  const { points } = props;

  // 計算に使用する基準点の座標を格納する変数を用意
  let baseLatitude: number;
  let baseLongitude: number;

  // 💡 1. ユーザーが駅名（station）を入力して検索した場合
  if (props.station) {
    const { station } = props;
    console.log(`--- 駅名・場所検索ルート (${station}) ---`);

    // 辞書データから駅の座標を探す（前方の完全一致をトリミング）
    const cleanStationName = station.trim();
    const matchedCoords = STATION_COORDINATES_MAP[cleanStationName];

    if (matchedCoords) {
      // 事前定義された駅が見つかった場合、その正確な座標を使用
      baseLatitude = matchedCoords.lat;
      baseLongitude = matchedCoords.lng;
      console.log(
        `マスターデータから ${cleanStationName} の座標を特定しました。`,
      );
    } else {
      // 💡 もし辞書にない未知の駅名が入力された場合のフォールバック（エラー落ちを防ぐ）
      // 実務ではここに外部のジオコーディングAPI（HeartRails Express等）から非同期で取得した座標を渡すのがベストです
      console.warn(
        `警告: ${cleanStationName} の座標データが登録されていません。仮の新宿駅座標を使用します。`,
      );
      baseLatitude = 35.6895;
      baseLongitude = 139.6917;
    }
  } else {
    // 💡 2. 現在地の緯度・経度（座標）から直接検索した場合
    const { latitude, longitude } = props;
    console.log("--- 現在地座標ルート ---");

    if (latitude === undefined || longitude === undefined) {
      return [];
    }

    baseLatitude = latitude;
    baseLongitude = longitude;
  }

  console.log("計算基準の緯度:", baseLatitude);
  console.log("計算基準の経度:", baseLongitude);

  // 各居酒屋（points）との距離を一括計算して `number[]` として return する
  const distances = points.map((point, index) => {
    const [targetLat, targetLng] = point;
    if (targetLat === undefined || targetLng === undefined) {
      return 0;
    }

    // 基準点の座標（特定された駅の座標、または現在地）を使って直線距離を計算
    const distance = calculateDistance(
      baseLatitude,
      baseLongitude,
      targetLat,
      targetLng,
    );

    console.log(`${index + 1}番目の店舗への直線距離: ${distance}メートル`);

    return distance;
  });

  return distances;
};
