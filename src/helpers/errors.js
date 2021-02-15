export class UniqueConstraintError extends Error {
  constructor(value) {
    super(`${value} must me unique.`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UniqueConstraintError);
    }
  }
}

export class InvalidPropertyError extends Error {
  constructor(msg) {
    super(`${msg} `);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError);
    }
  }
}

export class RequiredParamsError extends Error {
  constructor(param) {
    super(`${param} cannot be null or undefined.`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParamsError);
    }
  }
}

export class DocumentNotFoundError extends Error {
  constructor(docId) {
    super(`${docId} was not found in db.`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocumentNotFoundError);
    }
  }
}
