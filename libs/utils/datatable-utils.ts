const resolveColumnValue = (
  field: string,
  rowItem: Record<string, any>
): any => {
  return rowItem[field];
};

export { resolveColumnValue };
