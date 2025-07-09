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

    console.log("today:", dateStr);

    // 🔹 Фильтрация по дате (логика уточняется позже)

    let rowIndex;
    let cellIndex;

    datesData.values.forEach((row, rIndex) => {
      console.log("row:", row);

      row.forEach((cell, cIndex) => {
        // Проверка: есть ли значение и можно ли его превратить в дату
        if (cell) {
          console.log("cell:", cell);
          const parsed = new Date(cell);
          if (!isNaN(parsed)) {
            const cellDate = parsed.toISOString().split("T")[0];
            if (cellDate === dateStr) {
              rowIndex = rIndex;
              cellIndex = cIndex;
            }
          }
        }
      });
    });

    const sortedDateData = {
      value: datesData.values[rowIndex][cellIndex],
      background: datesData.backgrounds[rowIndex][cellIndex],
      comment: datesData.comments[rowIndex][cellIndex],
    };

    console.log("sortedDateData", sortedDateData);

    res.status(200).json({
      date: dateStr,
      degustationDate: sortedDateData,
    });

    console.log("📤 Отправлены данные за:", dateStr);
  } catch (err) {
    console.error("❌ Ошибка при получении ежедневных данных:", err);
    res.status(500).json({ error: "Ошибка получения данных" });
  }
}
