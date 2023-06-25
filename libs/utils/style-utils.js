const joinClasses = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export { joinClasses };
