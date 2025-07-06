import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
let db, collection;

async function connectToDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db("degustation");
    collection = db.collection("entries");
    console.log("✅ Подключено к MongoDB Atlas");
  } catch (error) {
    console.error("❌ Не удалось подключиться к MongoDB:", error);
    process.exit(1);
  }
}

app.post("/update-data", async (req, res) => {
  console.log("📥 Получено тело запроса:", req.body);

  const { sheetName, row, values } = req.body;

  const entry = {
    timestamp: new Date(),
    sheetName,
    row,
    values,
  };

  try {
    const result = await collection.insertOne(entry);
    res
      .status(200)
      .json({ message: "Данные сохранены", id: result.insertedId });
  } catch (err) {
    console.error("❌ Ошибка при сохранении в MongoDB:", err);
    res.status(500).json({ error: "Ошибка при сохранении" });
  }
});

app.get("/", (req, res) => {
  res.send("API для дегустаций с MongoDB работает!");
});

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
