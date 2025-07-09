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

    let datesDataRowIndex;
    let datesDataCellIndex;

    datesData.values.forEach((row, rIndex) => {
      console.log("datesData row:", row);

      row.forEach((cell, cIndex) => {
        // Проверка: есть ли значение и можно ли его превратить в дату
        if (cell) {
          console.log("datesData cell:", cell);
          const parsed = new Date(cell);
          if (!isNaN(parsed)) {
            const cellDate = parsed.toISOString().split("T")[0];
            if (cellDate === dateStr) {
              datesDataRowIndex = rIndex;
              datesDataCellIndex = cIndex;
            }
          }
        }
      });
    });

    const sortedDateData = {
      value: datesData.values[datesDataRowIndex][datesDataCellIndex],
      background: datesData.backgrounds[datesDataRowIndex][datesDataCellIndex],
      comment: datesData.comments[datesDataRowIndex][datesDataCellIndex],
    };

    console.log("sortedDateData", sortedDateData);

    let probsDataRowIndex;
    let probsDataCellindex;

    let probsDataRowCellArray = [];

    probsData.backgrounds.forEach((row, index) => {
      let tempRowIndex = index;
      console.log("probsData row:", row);

      row.forEach((cell, index) => {
        let tempCellIndex = index;
        if (cell === sortedDateData.background) {
          console.log("probsData cell:", cell);
          probsDataRowIndex = tempRowIndex;
          probsDataCellindex = tempCellIndex;
          probsDataRowCellArray.push([probsDataRowIndex, probsDataCellindex]);
        }
      });
    });

    console.log("probsDataRowCellArray", probsDataRowCellArray);

    let porbsToDegustate = [];

    probsDataRowCellArray.forEach((element) => {
      porbsToDegustate.push({
        lable: probsData.values[element[0]][2],
        aging: probsData.values[element[0]][element[1]],
      });
    });

    console.log("porbsToDegustate", porbsToDegustate);

    res.status(200).json({
      date: dateStr,
      degustationDate: sortedDateData,
      probsToDegustate: porbsToDegustate,
    });

    console.log("📤 Отправлены данные за:", dateStr);
  } catch (err) {
    console.error("❌ Ошибка при получении ежедневных данных:", err);
    res.status(500).json({ error: "Ошибка получения данных" });
  }
}
