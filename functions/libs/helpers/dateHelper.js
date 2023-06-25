const findDateDiff = (date1, date2) => {
  var time2 = date2.getTime();
  var time1 = date1.getTime();

  return parseInt((time2 - time1) / (24 * 3600 * 1000));
};

module.exports = {
  findDateDiff,
};
