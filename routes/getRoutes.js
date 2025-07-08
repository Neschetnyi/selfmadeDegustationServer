import express from "express";
import {
  getDegustationProbs,
  getDegustationDates,
} from "../controllers/getDegustationDataController.js";

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

  return router;
}
