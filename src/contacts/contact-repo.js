import makeContact from './contact';
import { UniqueConstraintError } from '../helpers/errors';

function documentToContact({ _id: contactId, ...doc }) {
  return makeContact({ contactId, ...doc });
}

const makeContactRepo = (database) => {
  return Object.freeze({
    add,
    findById,
    getItems,
  });

  async function add({ contactId, ...contact }) {
    const db = await database;
    if (contactId) {
      contact._id = db.makeId(contactId);
    }
    const { result, ops } = await db
      .collection('contacts')
      .insertOne(contact)
      .catch((mongoError) => {
        const [errorCode] = mongoError.message.split(' ');
        if (errorCode === 'E11000') {
          const [_, mongoIndex] = mongoError.message.split(':')[2].split(' ');
          throw new UniqueConstraintError(
            mongoIndex === 'ContactEmailIndex' ? 'emailAddress' : 'contactId'
          );
        }
        throw mongoError;
      });
    return {
      success: result.ok === 1,
      created: documentToContact(ops[0]),
    };
  }

  async function findById({ contactId }) {
    const db = await database;
    const found = await db.collection('contacts').findOne({ _id: contactId });
    if (found) {
      return documentToContact(found);
    }
    return null;
  }

  async function getItems({ before, next, limit = 100 } = {}) {
    const db = await database;
    const query = {};
    if (before || next) {
      query._id = {};
      query._id = before ? { ...query._id, $lt: db.makeId(before) } : query._id;
      query._id = next ? { ...query._id, $gt: db.makeId(next) } : query._id;
    }
    const contacts = (
      await db.collection('contacts').find(query).limit(Number(limit)).toArray()
    ).map(documentToContact);
    return contacts;
  }
};

export default makeContactRepo;
