export const encodeUrl = (url: string) => {
  const cleanAddress = (url || "").replace(/[\s\u3000]/g, "");
  const mapUrl = `https://google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddress)}`;
  return mapUrl;
};
