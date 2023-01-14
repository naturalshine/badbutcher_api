// ./src/database/slaughtered.js
const { getDatabase } = require('./mongo');
const { ObjectId } = require('mongodb');

const collectionName = 'slaughtered';

async function insertSlaughtered(slaughter) {
  const database = await getDatabase();
  const {insertedId} = await database.collection(collectionName).insertOne(slaughter);
  return insertedId;
}

async function getSlaughtered() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}


async function deleteSlaughtered(id) {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectId(id),
  });
}

async function updateSlaughtered(id, ad) {
  const database = await getDatabase();
  delete ad._id;
  await database.collection(collectionName).update(
    { _id: new ObjectId(id), },
    {
      $set: {
        ...ad,
      },
    },
  );
}


module.exports = {
    insertSlaughtered,
    getSlaughtered,
    deleteSlaughtered,
    updateSlaughtered
};