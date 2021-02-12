const upperFirst = (word) => {
  if (word.length === 0) {
    return word.toUpperCase();
  }
  return word.charAt(0).toUpperCase() + word.substring(1);
};

export default upperFirst;
