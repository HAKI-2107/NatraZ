import { config, configured } from "../lib/config";

export type AlertChannel = "sms" | "voice";

export interface AgentPhoneVerification {
  connected: boolean;
  authenticated: boolean;
  configured: boolean;
  provider: "agentphone";
  phoneNumbers: Array<{ number: string }>;
  reason?: string;
  timestamp: string;
}

export interface AlertRequest {
  phoneNumber: string;
  message: string;
  channel: AlertChannel;
}

export interface AlertResult {
  success: boolean;
  channel: AlertChannel;
  messageId?: string;
  providerStatus?: string;
  reason?: string;
  timestamp: string;
}

/**
 * AgentPhone is kept behind a provider adapter because the available
 * workspace integration exposes MCP tools, not a documented app HTTP API.
 * This prevents IrisMap from inventing request paths or silently sending
 * real messages. A provider-specific transport can be added here later.
 */
export function verifyConnection(): AgentPhoneVerification {
  const hasKey = configured(config.agentPhoneApiKey);
  return {
    connected: false,
    authenticated: false,
    configured: hasKey,
    provider: "agentphone",
    phoneNumbers: [],
    reason: hasKey ? "provider_transport_not_configured" : "missing_credentials",
    timestamp: new Date().toISOString(),
  };
}

export async function sendAlert(request: AlertRequest): Promise<AlertResult> {
  const verification = verifyConnection();
  if (!verification.configured) {
    return {
      success: false,
      channel: request.channel,
      reason: "missing_credentials",
      timestamp: new Date().toISOString(),
    };
  }

  return {
    success: false,
    channel: request.channel,
    providerStatus: "not_configured",
    reason: "provider_transport_not_configured",
    timestamp: new Date().toISOString(),
  };
}