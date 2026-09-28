export type IntegrationState = "connected" | "configured" | "not_configured" | "error";

export interface SafeIntegrationStatus {
  provider: string;
  connected: boolean;
  configured: boolean;
  status: IntegrationState;
  reason?: string;
}

export interface McpStatus {
  railway: SafeIntegrationStatus;
  cloudflare: SafeIntegrationStatus;
  openai: SafeIntegrationStatus;
  googleMaps: SafeIntegrationStatus;
  agentPhone: SafeIntegrationStatus;
  timestamp: string;
}