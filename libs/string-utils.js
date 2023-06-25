import { getCounterById } from "./managers/counterManager";

const getYoutubeVideoId = (url) => {
  const videoid = url.match(
    /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
  );
  return videoid ? videoid[1] : null;
};

const genSlug = (text) => {
  let slug = "";
  if (text && typeof text === "string") {
    console.log(text);
    slug = text
      .trim() //remove white space at start & end
      .toLowerCase() //set EN characters to lower case
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ""
      ) //remove all emoji icons
      .replaceAll(" ", "-") //replace any space to dash
      .replaceAll("@", "แอท")
      .replaceAll("%", "เปอร์เซนต์")
      .replaceAll("&", "แอนด์")
      .replaceAll("/", "ต่อ")
      .replaceAll(/[`~!@#$%^&*()_\+=\[\]{};:'"\\|\/,.<>?\s]/g, "")
      .replaceAll(/\s\s+/g, "-") //remove consecutive whitespace to one dash
      .replaceAll(/-+/g, "-") //remove consecutive dashes to one dash
      .replaceAll(/^-+/g, "") //remove dash at start of string
      .replaceAll(/-+$/g, ""); //remove dash at end of string
  }
  return slug;
};

const randomLetter = () => {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26)) || "2";
  // return "hex";
};

const genPostNumber = async () => {
  const postCurrentCounter = await getCounterById("1X2g3DiBCwvGILUOdPP1");
  console.log("getCounterById", postCurrentCounter);

  const date = new Date();
  const yearPart = date.getFullYear().toString().substring(2, 4);
  const monthPart = ("0" + (date.getMonth() + 1)).slice(-2);
  const randomChars = randomLetter();
  // const running = "00137";
  const postNumber =
    yearPart +
    randomChars +
    monthPart +
    zeroPad(+postCurrentCounter.counterVal, 5);
  return postNumber;
};

const zeroPad = (num, places) => String(num).padStart(places, "0");

export { getYoutubeVideoId, genSlug, randomLetter, genPostNumber };
