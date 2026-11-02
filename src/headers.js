import { resolveProviderRequestHeaders } from "openclaw/plugin-sdk/provider-http";

// Proposed client attribution; backend ingestion has not yet been agreed or verified.
export const FORTYTWO_ATTRIBUTION_HEADERS = {
  "HTTP-Referer": "https://openclaw.ai",
  "X-Title": "OpenClaw",
};

export function fortytwoHeaders(
  transport,
  callerHeaders,
) {
  return resolveProviderRequestHeaders({
    provider: "fortytwo",
    api: "openai-completions",
    baseUrl: "https://api.fortytwo.network/v1",
    capability: "llm",
    transport,
    callerHeaders,
    defaultHeaders: FORTYTWO_ATTRIBUTION_HEADERS,
    precedence: "defaults-win",
  });
}
