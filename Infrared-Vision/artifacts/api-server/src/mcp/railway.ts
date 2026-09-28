import { config, configured } from "../lib/config";
import type { SafeIntegrationStatus } from "./types";

/**
 * Railway is intentionally kept behind this adapter. The Replit Railway MCP
 * connection is available to agent tooling, but it is not an application HTTP
 * client. Until a Railway app API endpoint is explicitly configured, report
 * credential state without fabricating a provider request.
 */
export function getRailwayStatus(): SafeIntegrationStatus {
  if (!configured(config.railwayToken)) {
    return {
      provider: "railway",
      connected: false,
      configured: false,
      status: "not_configured",
      reason: "missing_credentials",
    };
  }

  return {
    provider: "railway",
    connected: false,
    configured: true,
    status: "configured",
    reason: "provider_endpoint_not_configured",
  };
}