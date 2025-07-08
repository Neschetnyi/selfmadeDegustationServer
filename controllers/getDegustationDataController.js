export async function getDegustationProbs(req, res, degustationProbs) {
  try {
    const data = await degustationProbs.find().toArray();
    res.status(200).json({ data });
  } catch (err) {
    console.error("❌ Ошибка при получении degustationProbs:", err);
    res.status(500).json({ error: "Ошибка при получении данных" });
  }
}

export async function getDegustationDates(req, res, degustationDates) {
  try {
    const data = await degustationDates.find().toArray();
    res.status(200).json({ data });
  } catch (err) {
    console.error("❌ Ошибка при получении degustationDates:", err);
    res.status(500).json({ error: "Ошибка при получении данных" });
  }
}
