import { Router, type IRouter } from "express";
import { z } from "zod";
import { getMcpStatus } from "../mcp";
import { sendAlert, verifyConnection } from "../services/agentPhone";

const router: IRouter = Router();

const alertSchema = z.object({
  phoneNumber: z.string().trim().regex(/^\+[1-9]\d{7,14}$/, "phoneNumber must be an E.164 number"),
  message: z.string().trim().min(1).max(480),
  channel: z.enum(["sms", "voice"]).default("sms"),
});

router.get("/mcp/status", (_req, res) => {
  res.json(getMcpStatus());
});

router.get("/agentphone/verify", (_req, res) => {
  res.json(verifyConnection());
});

router.post("/agentphone/alert", async (req, res) => {
  const parsed = alertSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: parsed.error.issues[0]?.message ?? "Invalid alert request",
      },
    });
    return;
  }

  const result = await sendAlert(parsed.data);
  if (!result.success) {
    res.status(503).json({
      success: false,
      error: {
        code: "ALERT_PROVIDER_UNAVAILABLE",
        message: "AgentPhone alert dispatch is unavailable.",
        reason: result.reason,
      },
      result,
    });
    return;
  }

  res.json(result);
});

export default router;