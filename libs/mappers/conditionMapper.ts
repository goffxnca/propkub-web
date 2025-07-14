import { Condition } from "../../src/types/misc/condition";

const conditions: Condition[] = [
  { id: "used", label: "มือสอง" },
  { id: "new", label: "โครงการใหม่" },
];

const getCondition = (condition: string): string => {
  return conditions.find((c) => c.id === condition).label;
};

export { conditions, getCondition };
