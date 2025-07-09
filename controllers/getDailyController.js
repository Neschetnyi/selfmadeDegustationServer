export async function getDailyData(
  req,
  res,
  { degustationDates, degustationProbs }
) {
  try {
    // ✅ забираем дату из строки запроса
    const inputDate = req.query.date;
    const today = inputDate ? new Date(inputDate) : new Date();

    const dateStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    // 🔹 Получаем все данные
    const datesData = await degustationDates.findOne({
      sheetName: "Список проб25 даты",
    });
    const probsData = await degustationProbs.findOne({
      sheetName: "Список проб25 даты",
    });
    /*
    console.log("datesData:", datesData);
    console.log("probsData:", probsData);
*/
    /*
    // 🔹 Фильтрация по дате (логика уточняется позже)
    const filteredDates = datesData.filter((doc) =>
      doc.sheetName.includes(dateStr)
    );
    const filteredProbs = probsData.filter((doc) =>
      doc.sheetName.includes(dateStr)
    );
*/
    res.status(200).json({
      date: dateStr,
      degustationDates: datesData,
      degustationProbs: probsData,
    });

    console.log("📤 Отправлены данные за:", dateStr);
  } catch (err) {
    console.error("❌ Ошибка при получении ежедневных данных:", err);
    res.status(500).json({ error: "Ошибка получения данных" });
  }
}
