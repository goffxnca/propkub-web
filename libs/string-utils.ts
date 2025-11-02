const getYoutubeVideoId = (url: string) => {
  const videoId = url.match(
    /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
  );
  return videoId ? videoId[1] : null;
};

const randomLetter = () => {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26)) || '2';
  // return "hex";
};

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

const orDefault = <T>(value: T, defaultValue: string = '-'): T | string =>
  value == null || value === '' || (Array.isArray(value) && !value.length)
    ? defaultValue
    : value;

const getLineUrl = (lineId?: string | null) => {
  if (!lineId) return null;
  return `https://line.me/ti/p/~${lineId}`;
};

export { getYoutubeVideoId, randomLetter, zeroPad, orDefault, getLineUrl };
