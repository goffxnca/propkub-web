const getYoutubeVideoId = (url) => {
  const videoid = url.match(
    /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
  );
  return videoid ? videoid[1] : null;
};

const randomLetter = () => {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26)) || '2';
  // return "hex";
};

const zeroPad = (num, places) => String(num).padStart(places, '0');

const orDefault = (value, defaultValue = '-') =>
  value == null || value === '' || (Array.isArray(value) && !value.length)
    ? defaultValue
    : value;

const getLineUrl = (lineId) => {
  if (!lineId) return null;
  return `https://line.me/ti/p/~${lineId}`;
};

export { getYoutubeVideoId, randomLetter, zeroPad, orDefault, getLineUrl };
