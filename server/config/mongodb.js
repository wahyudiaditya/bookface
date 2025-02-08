import { MongoClient } from "mongodb";
const uri = `mongodb+srv://admin:${process.env.MONGODB_PW}@cluster0.zdsut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let db = null;
let client = null;

async function connect() {
  try {
    client = new MongoClient(uri);

    db = client.db("BookFace-app");
    return db;
  } catch (err) {
    console.log("🚀 ~ connect ~ err:", err);
  }
}

const getDB = () => {
  if (!db) connect();

  return db;
};

export { getDB, client };
