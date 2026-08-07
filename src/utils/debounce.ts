export const debounce = <T>(fn: (...args: T[]) => void, delay: number) => {
  let t: ReturnType<typeof setTimeout> | null = null;
  return function (...args: T[]) {
    if (t) {
      clearTimeout(t);
    }
    t = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
