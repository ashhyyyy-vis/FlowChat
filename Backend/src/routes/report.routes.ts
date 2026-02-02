// routes/report.ts
import { Router } from "express";
import Report from "../models/report";

const router = Router();

router.post("/", async (req, res) => {
  const {
    reporterDeviceId,
    reportedDeviceId,
    sessionId,
    reason
  } = req.body;

  if (
    !reporterDeviceId ||
    !reportedDeviceId ||
    !sessionId ||
    !reason
  ) {
    return res.status(400).json({ error: "Invalid report payload" });
  }

  if (reporterDeviceId === reportedDeviceId) {
    return res.status(400).json({ error: "Self-report not allowed" });
  }

  await Report.create({
    reporterDeviceId,
    reportedDeviceId,
    sessionId,
    reason
  });

  return res.json({ success: true });
});

export default router;
