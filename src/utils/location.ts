type Coordinates = {
  latitude: number;
  longitude: number;
};

interface LocationError extends Error {
  code: number;
}

// エラーメッセージ返答
const getLocationErrorMessage = (code: number) => {
  switch (code) {
    case 1:
      return "位置情報の利用が許可されていません。ブラウザの設定をご確認ください。";

    case 2:
      return "現在位置を取得できませんでした。電波状況の良い場所でもう一度お試しください。";

    case 3:
      return "位置情報の取得がタイムアウトしました。もう一度お試しください。";

    default:
      return "現在位置を取得できませんでした。もう一度お試しください。";
  }
};

/**
 * 現在地の緯度・経度を取得
 */
export const currentLocation = (): Promise<Coordinates> => {
  return new Promise<Coordinates>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // trigger mutation
          resolve({ latitude, longitude });
        },
        (error) => {
          const errorMessage = getLocationErrorMessage(error.code);
          const locationNewError = new Error(errorMessage) as LocationError;
          locationNewError.code = error.code;
          reject(locationNewError);
        },
        {
          enableHighAccuracy: false,
          timeout: 7000,
          maximumAge: 60000,
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  });
};
