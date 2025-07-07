import dotenv from "dotenv";
import app from "./app.js";
import createUpdateRouter from "./routes/updateRoutes.js";
import { connectToMongo } from "./db/mongoClient.js";

dotenv.config();

const PORT = process.env.PORT || 10000;

(async () => {
  try {
    const collection = await connectToMongo();
    app.use("/", createUpdateRouter(collection));

    app.get("/", (req, res) => {
      res.send("API для дегустаций с MongoDB работает!");
    });

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Ошибка запуска сервера:", err);
    process.exit(1);
  }
})();
