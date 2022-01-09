export const filterTag = (text) => {
  return (text = text.replaceAll('<', '&lt').replaceAll('>', '&gt'));
};
