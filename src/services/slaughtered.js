// ./src/database/slaughtered.js
const { getDatabase } = require('../database/mongo');
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

async function getSingleSlaughtered(sid){
    const database = await getDatabase();
    return await database.collection(collectionName).find({id: sid}).toArray();
}


async function deleteSlaughtered(id) {
  const database = await getDatabase();
  return await database.collection(collectionName).deleteOne({
    _id: new ObjectId(id),
  });
}

async function updateSlaughtered(id, insertKey, insertVal) {
  const database = await getDatabase();
  return await db.collection(collectionName).update(
    { '_id':id }, 
    { insertKey : insertVal }
  ); 
}
  // reset field: {$set: {image : filename}}, 
  /*return await database.collection(collectionName).update(
    { _id: new ObjectId(id), },
    {
      $set: {
        ...img,
      },
    },
  );
}*/


module.exports = {
    insertSlaughtered,
    getSlaughtered,
    deleteSlaughtered,
    updateSlaughtered,
    getSingleSlaughtered
};