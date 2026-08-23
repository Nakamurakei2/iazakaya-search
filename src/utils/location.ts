type Coordinates = {
  latitude: number;
  longitude: number;
};

/**
 * 現在地の緯度・経度を取得
 */
export const currentLocation = (): Promise<Coordinates> => {
  return new Promise<Coordinates>(async (resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // trigger mutation
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error("Error Code:", error.code, " - ", error.message);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  });
};