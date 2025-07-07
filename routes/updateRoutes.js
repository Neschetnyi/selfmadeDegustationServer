import express from "express";
import { handleUpdateData } from "../controllers/updateController.js";

export default function createUpdateRouter(collection) {
  const router = express.Router();

  router.post("/update-data", (req, res) =>
    handleUpdateData(req, res, collection)
  );

  return router;
}
