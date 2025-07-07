export async function handleUpdateData(req, res, collection) {
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
    res.status(200).json({
      message: "Данные сохранены",
      insertedCount: result.insertedCount,
    });
  } catch (err) {
    console.error("Ошибка сохранения:", err);
    res.status(500).json({ error: "Ошибка при сохранении данных" });
  }
}
