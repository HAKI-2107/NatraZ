import { config, configured } from "../lib/config";
import type { SafeIntegrationStatus } from "./types";

export function getCloudflareStatus(): SafeIntegrationStatus {
  if (!configured(config.cloudflareToken) || !configured(config.cloudflareAccountId)) {
    return {
      provider: "cloudflare",
      connected: false,
      configured: false,
      status: "not_configured",
      reason: "missing_credentials",
    };
  }

  return {
    provider: "cloudflare",
    connected: false,
    configured: true,
    status: "configured",
    reason: "provider_endpoint_not_configured",
  };
}