import { config, configured } from "../lib/config";
import { getCloudflareStatus } from "./cloudflare";
import { getRailwayStatus } from "./railway";
import type { McpStatus, SafeIntegrationStatus } from "./types";

const configuredStatus = (provider: string, isConfigured: boolean): SafeIntegrationStatus => ({
  provider,
  connected: false,
  configured: isConfigured,
  status: isConfigured ? "configured" : "not_configured",
  reason: isConfigured ? undefined : "missing_credentials",
});

export function getMcpStatus(): McpStatus {
  return {
    railway: getRailwayStatus(),
    cloudflare: getCloudflareStatus(),
    openai: configuredStatus("openai", configured(config.openaiApiKey)),
    googleMaps: configuredStatus("google_maps", configured(config.googleMapsApiKey)),
    agentPhone: configuredStatus("agentphone", configured(config.agentPhoneApiKey)),
    timestamp: new Date().toISOString(),
  };
}