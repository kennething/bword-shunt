import { Router } from "express";

const router = Router();

router.get("/status", (req, res) => {
  console.log(`-> ${req.ip} | ${req.headers["user-agent"]}`);
  res.sendStatus(200);
});

export default router;
