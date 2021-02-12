import makeDb from '../db';
import makeContactRepo from './contact-repo';
import makeContactsHandler from './contacts-handler';

const db = makeDb();
const contactRepo = makeContactRepo(db);
const contactsHandler = makeContactsHandler(contactRepo);

export default contactsHandler;
