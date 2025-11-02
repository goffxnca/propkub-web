export const sleep = (seconds: number = 5): Promise<void> => {
  console.log(`💤 Sleeping for ${seconds} seconds...`);
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
