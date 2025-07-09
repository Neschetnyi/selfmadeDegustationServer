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
      sheetName: "Список проб25 пробы",
    });
    /*
    console.log("datesData:", datesData);
    console.log("probsData:", probsData);
*/

    console.log("today:", today);

    // 🔹 Фильтрация по дате (логика уточняется позже)

    let rowIndex;
    let cellIndex;

    datesData.values.forEach((row, index) => {
      const tempRowIndex = index;
      row.forEach((cell, index) => {
        const cellDate = new Date(cell).toISOString().split("T")[0];
        const tempCellIndex = index;
        if (cellDate === today) {
          rowIndex = tempRowIndex;
          cellIndex = tempCellIndex;
        }
      });
    });

    const sortedDateData = {
      value: datesData.values[rowIndex][cellIndex],
      background: datesData.backgrounds[rowIndex][cellIndex],
      comment: datesData.comments[rowIndex][cellIndex],
    };

    res.status(200).json({
      date: dateStr,
      degustationDate: sortedDateData,
      degustationProbs: probsData,
    });

    console.log("📤 Отправлены данные за:", dateStr);
  } catch (err) {
    console.error("❌ Ошибка при получении ежедневных данных:", err);
    res.status(500).json({ error: "Ошибка получения данных" });
  }
}
