import { InvalidPropertyError } from '../helpers/errors';
import isValidEmail from '../helpers/is-valid-email';
import requiredParam from '../helpers/required-param';
import upperFirst from '../helpers/upper-first';

const makeContact = (contactInfo = requiredParam('contactInfo')) => {
  const validateContact = validate(contactInfo);
  const normalContact = normalize(validateContact);
  return Object.freeze(normalContact);

  function validate({
    firstName = requiredParam('firsName'),
    lastName = requiredParam('lastName'),
    emailAddress = requiredParam('emailAddress'),
    ...otherInfo
  }) {
    validateName('firstName', firstName);
    validateName('lastName', lastName);
    validateEmail(emailAddress);

    return { firstName, lastName, emailAddress, ...otherInfo };
  }

  function normalize({ firstName, lastName, emailAddress, ...otherInfo }) {
    return {
      ...otherInfo,
      firstName: upperFirst(firstName),
      lastName: upperFirst(lastName),
      emailAddress: emailAddress.toLowerCase(),
    };
  }

  function validateName(label, name) {
    if (name.length < 2) {
      throw new InvalidPropertyError(
        `A contact's ${label} name must be at least 2 symbols long.`
      );
    }
  }

  function validateEmail(emailAddress) {
    if (!isValidEmail(emailAddress)) {
      throw new InvalidPropertyError('Invalid contact email address');
    }
  }
};

export default makeContact;
