import express from "express";
import {
  getDegustationProbs,
  getDegustationDates,
} from "../controllers/getDegustationDataController.js";
import { getDailyData } from "../controllers/getDailyController.js";

export default function createGetRouter({
  degustationProbs,
  degustationDates,
}) {
  const router = express.Router();

  router.get("/get-degustationProbs", (req, res) =>
    getDegustationProbs(req, res, degustationProbs)
  );

  router.get("/get-degustationDates", (req, res) =>
    getDegustationDates(req, res, degustationDates)
  );

  router.get("/get-daily", (req, res) =>
    getDailyData(req, res, { degustationDates, degustationProbs })
  );

  return router;
}
