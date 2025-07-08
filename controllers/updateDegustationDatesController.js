export async function handleUpdateDegustationDates(req, res, degustationDates) {
  const { sheets, timestamp } = req.body;

  if (!Array.isArray(sheets)) {
    return res.status(400).json({ error: "Sheets must be an array" });
  }

  try {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const sheet of sheets) {
      const query = { sheetName: sheet.sheetName };

      const existingDoc = await degustationDates.findOne(query);

      const newDoc = {
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        sheetName: sheet.sheetName,
        values: sheet.values,
        backgrounds: sheet.backgrounds,
        comments: sheet.comments,
      };

      if (!existingDoc) {
        // 🔹 Если документа нет — вставляем
        await degustationDates.insertOne(newDoc);
        inserted++;
      } else {
        // 🔹 Если есть — сравниваем
        const isSame =
          JSON.stringify(existingDoc.values) === JSON.stringify(sheet.values) &&
          JSON.stringify(existingDoc.backgrounds) ===
            JSON.stringify(sheet.backgrounds) &&
          JSON.stringify(existingDoc.comments) ===
            JSON.stringify(sheet.comments);

        if (isSame) {
          skipped++;
        } else {
          // 🔹 Если отличается — обновляем
          await degustationDates.replaceOne({ _id: existingDoc._id }, newDoc);
          updated++;
        }
      }
    }

    res.status(200).json({
      message: "Обработка завершена",
      inserted,
      updated,
      skipped,
    });

    console.log("📥 Получены данные о датах от Google Sheets:");
    console.log("⏰ Время:", new Date().toISOString());
    console.log(
      `✅ Добавлено: ${inserted} | 🔄 Обновлено: ${updated} | ⏭ Пропущено: ${skipped}`
    );
  } catch (err) {
    console.error("❌ Ошибка сохранения:", err);
    res.status(500).json({ error: "Ошибка при сохранении данных" });
  }
}
