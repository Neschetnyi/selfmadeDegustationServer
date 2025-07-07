import { MongoClient } from "mongodb";

export async function connectToMongo() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db("degustation");
  const collection = db.collection("entries");
  console.log("✅ Подключено к MongoDB Atlas :)");
  return collection;
}
