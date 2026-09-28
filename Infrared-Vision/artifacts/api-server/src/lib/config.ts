export const config = {
  openaiApiKey: process.env["OPENAI_API_KEY"],
  openaiModel: process.env["OPENAI_MODEL"] ?? "gpt-4o",
  googleMapsApiKey: process.env["GOOGLE_MAPS_API_KEY"],
  railwayToken: process.env["RAILWAY_API_TOKEN"],
  cloudflareToken: process.env["CLOUDFLARE_API_TOKEN"],
  cloudflareAccountId: process.env["CLOUDFLARE_ACCOUNT_ID"],
  agentPhoneApiKey: process.env["AGENTPHONE_API_KEY"],
  agentPhoneDefaultChannel: process.env["AGENTPHONE_DEFAULT_CHANNEL"] ?? "sms",
  automaticAlertsEnabled: process.env["ENABLE_AUTOMATIC_ALERTS"] === "true",
};

export const configured = (value: string | undefined) => Boolean(value?.trim());