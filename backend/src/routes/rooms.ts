import { rooms } from "../utils/data";
import { Router } from "express";

const router = Router();

router.get("/rooms", (_req, res) => {
  res.json(Array.from(rooms.values()).sort((a, b) => b.players.length - a.players.length));
});

export default router;
