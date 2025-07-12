const getUnixEpochTime = () => {
  return Date.now().toString();
};

const getLocalDateByISODateString = (isoDateSting) => {
  const date = new Date(isoDateSting);
  return date.toLocaleDateString("th");
};

const getLocalDateTimeByISODateString = (isoDateSting) => {
  const date = new Date(isoDateSting);
  const timeSegments = date.toLocaleTimeString("th").split(":");
  const time = timeSegments[0] + ":" + timeSegments[1];
  return `${date.toLocaleDateString("th")} ${time}`;
};

const getThaiFullDateTimeString = (isoDateString) => {
  return new Date(isoDateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export {
  getUnixEpochTime,
  getLocalDateByISODateString,
  getLocalDateTimeByISODateString,
  getThaiFullDateTimeString,
};
