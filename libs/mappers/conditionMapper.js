const conditions = [
  { id: "used", label: "มือสอง" },
  { id: "new", label: "โครงการใหม่" },
];

const getCondition = (condition) => {
  return conditions.find((c) => c.id === condition)?.label ?? "";
};

export { conditions, getCondition };
