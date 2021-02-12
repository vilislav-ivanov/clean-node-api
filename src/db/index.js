import mongodb from 'mongodb';

const makeIdFromString = (id) => {
  return new mongodb.ObjectID(id);
};

export default async () => {
  const MongoClient = mongodb.MongoClient;
  const url = 'mongodb://localhost:27017';
  const dbName = 'mm_api_demo';
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  const db = client.db(dbName);
  db.makeId = makeIdFromString;
  return db;
};
