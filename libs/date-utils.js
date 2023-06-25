const getUnixEpochTime = () => {
  return Date.now();
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

export {
  getUnixEpochTime,
  getLocalDateByISODateString,
  getLocalDateTimeByISODateString,
};
