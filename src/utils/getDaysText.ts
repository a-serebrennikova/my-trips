export const getDaysText = (days: number): string => {
  if (days === 1) {
    return "1 day";
  } else {
    return `${days} days`;
  }
};
