const isValidEmail = (email) => {
  const valid = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  return valid.test(email);
};

export default isValidEmail;
