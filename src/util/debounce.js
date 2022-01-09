let timer = null;
export const debounce = (callback, time) => {
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(callback, time);
  };
};
