console.log("🔍 MONGODB_URI =", process.env.MONGODB_URI);
require("dotenv").config();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  console.log("··· connectToDatabase başladı");
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  console.log("··· MongoClient.connect tamam");
  database = client.db();
}

function getDb() {
  if (!database) {
    throw new Error("You must connect first to database!");
  }
  return database;
}

module.exports = {
  connectToDatabase,
  getDb,
};
