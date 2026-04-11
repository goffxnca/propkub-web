export function randomItem<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot select random item from empty array');
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
