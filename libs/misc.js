export const sleep = (seconds = 5) => {
  console.log(`💤 Sleeping for ${seconds} seconds...`);
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
