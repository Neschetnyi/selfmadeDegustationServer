import express from "express";
import { handleUpdateDegustationProbs } from "../controllers/updateDegustationProbsController.js";
import { handleUpdateDegustationDates } from "../controllers/updateDegustationDatesController.js";

export default function createUpdateRouter({
  degustationProbs,
  degustationDates,
}) {
  const router = express.Router();

  router.post("/update-degustationProbs", (req, res) =>
    handleUpdateDegustationProbs(req, res, degustationProbs)
  );

  router.post("/update-degustationDates", (req, res) =>
    handleUpdateDegustationDates(req, res, degustationDates)
  );

  return router;
}
