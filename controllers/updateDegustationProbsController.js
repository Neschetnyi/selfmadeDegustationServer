export async function handleUpdateDegustationProbs(req, res, degustationProbs) {
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

      const existingDoc = await degustationProbs.findOne(query);

      const newDoc = {
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        sheetName: sheet.sheetName,
        values: sheet.probsValues,
        backgrounds: sheet.probsBackgrounds,
        comments: sheet.probsComments,
      };

      if (!existingDoc) {
        // 🔹 Если документа нет — вставляем
        await degustationProbs.insertOne(newDoc);
        inserted++;
      } else {
        // 🔹 Если есть — сравниваем
        const isSame =
          JSON.stringify(existingDoc.probsValues) ===
            JSON.stringify(sheet.probsValues) &&
          JSON.stringify(existingDoc.probsBackgrounds) ===
            JSON.stringify(sheet.probsBackgrounds) &&
          JSON.stringify(existingDoc.probsComments) ===
            JSON.stringify(sheet.probsComments);

        if (isSame) {
          skipped++;
        } else {
          // 🔹 Если отличается — обновляем
          await degustationProbs.replaceOne({ _id: existingDoc._id }, newDoc);
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

    console.log("📥 Получены данные о пробах от Google Sheets:");
    console.log("⏰ Время:", new Date().toISOString());
    console.log(
      `✅ Добавлено: ${inserted} | 🔄 Обновлено: ${updated} | ⏭ Пропущено: ${skipped}`
    );
  } catch (err) {
    console.error("❌ Ошибка сохранения:", err);
    res.status(500).json({ error: "Ошибка при сохранении данных" });
  }
}
