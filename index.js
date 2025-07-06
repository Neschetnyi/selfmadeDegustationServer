import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

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
  const { sheets, timestamp } = req.body;

  if (!Array.isArray(sheets)) {
    return res.status(400).json({ error: "Sheets must be an array" });
  }

  try {
    const docs = sheets.map((sheet) => ({
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      sheetName: sheet.sheetName,
      values: sheet.values,
      backgrounds: sheet.backgrounds,
    }));

    const result = await collection.insertMany(docs);
    res
      .status(200)
      .json({
        message: "Данные сохранены",
        insertedCount: result.insertedCount,
      });
  } catch (err) {
    console.error("Ошибка сохранения:", err);
    res.status(500).json({ error: "Ошибка при сохранении данных" });
  }
});

app.get("/", (req, res) => {
  res.send("API для дегустаций с MongoDB работает!");
});

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
