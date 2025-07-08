import { MongoClient } from "mongodb";

export async function connectToMongo() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db("degustation");
  const degustationProbs = db.collection("degustationProbs");
  const degustationDates = db.collection("degustationDates");

  console.log("✅ Подключено к MongoDB Atlas :)");
  return { degustationProbs, degustationDates };
}
