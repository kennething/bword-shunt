import { rooms } from "../utils/data";
import { Router } from "express";

const router = Router();

router.get("/rooms", (_req, res) => {
  res.json(Array.from(rooms.values()));
});

export default router;
