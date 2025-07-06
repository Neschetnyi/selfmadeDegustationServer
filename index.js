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
  console.log("📥 Получено тело запроса:", req.body);

  const { sheets, sheetName, row, values } = req.body;

  try {
    if (sheets && Array.isArray(sheets)) {
      // Пришёл массив листов — вставляем несколько документов
      const docs = sheets.map((sheet) => ({
        timestamp: new Date(),
        sheetName: sheet.sheetName,
        values: sheet.values,
      }));

      const result = await collection.insertMany(docs);
      res
        .status(200)
        .json({
          message: "Данные сохранены (много листов)",
          insertedCount: result.insertedCount,
        });
    } else if (sheetName) {
      // Старый формат: один лист, одна строка
      const entry = {
        timestamp: new Date(),
        sheetName,
        row,
        values,
      };
      const result = await collection.insertOne(entry);
      res
        .status(200)
        .json({
          message: "Данные сохранены (один лист)",
          id: result.insertedId,
        });
    } else {
      res.status(400).json({ error: "Неправильный формат данных" });
    }
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
