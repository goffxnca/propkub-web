const getDropwnOptions = (total) => {
  return [{ id: 0, label: "0" }].concat(
    [...Array(total).keys()].map((i) => ({ id: i + 1, label: i + 1 }))
  );
};

export { getDropwnOptions };
