import {
  InvalidPropertyError,
  RequiredParamsError,
  UniqueConstraintError,
} from '../helpers/errors';
import makeContact from './contact';
import makeHttpError from '../helpers/http-error';

function makeContactsEndPoint(contactRepo) {
  return (httpRequest) => {
    switch (httpRequest.method) {
      case 'POST':
        return postContact(httpRequest);
      case 'GET':
        return getContacts(httpRequest);
      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  async function postContact(httpRequest) {
    let contactInfo = httpRequest.body;
    const { id } = httpRequest.pathParams || {};
    const { firstName, lastName, emailAddress } = contactInfo;

    if (!contactInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: 'Bad request. No POST body.',
      });
    }

    if (typeof httpRequest.body === 'string') {
      try {
        contactInfo = JSON.parse(contactInfo);
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: 'Bad request. POST body must be valid JSON.',
        });
      }
    }

    try {
      let contact;
      if (!id) {
        contact = makeContact(contactInfo);
      }
      if (id && !firstName && !lastName && !emailAddress) {
        return makeHttpError({
          statusCode: 400,
          errorMessage: 'Bad request. No POST body.',
        });
      }
      const result = id
        ? await contactRepo.update({ contactId: id, ...contactInfo })
        : await contactRepo.add(contact);
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        data: JSON.stringify(result),
      };
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof UniqueConstraintError
            ? 409
            : e instanceof InvalidPropertyError ||
              e instanceof RequiredParamsError
            ? 400
            : 500,
      });
    }
  }
  async function getContacts(httpRequest) {
    const { id } = httpRequest.pathParams || {};
    const { before, next, limit } = httpRequest.queryParams || {};

    const result = id
      ? await contactRepo.findById({ contactId: id })
      : await contactRepo.getItems({ before, next, limit });
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
      data: JSON.stringify(result),
    };
  }
}

export default makeContactsEndPoint;
