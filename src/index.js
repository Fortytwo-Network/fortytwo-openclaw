import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
import manifest from "../openclaw.plugin.json" with { type: "json" };
import { fortytwoHeaders } from "./headers.js";
import { applyConfig, DEFAULT_MODEL } from "./onboard.js";

const plugin = defineSingleProviderPluginEntry({
  id: "fortytwo",
  name: "Fortytwo",
  description: "Fortytwo Chat Completions provider",
  manifest,
  provider: {
    label: "Fortytwo",
    docsPath: "/providers/fortytwo",
    manifestAuth: { defaultModel: DEFAULT_MODEL, applyConfig },
    catalog: {
      discoveryMode: "strict",
      liveModelDiscovery: {
        buildRequestHeaders: ({ apiKey, discoveryApiKey }) => Object.fromEntries(
          Object.entries(fortytwoHeaders("http", {
            Authorization: `Bearer ${discoveryApiKey ?? apiKey ?? ""}`,
            Accept: "application/json",
          }) ?? {}).filter((entry) => typeof entry[1] === "string"),
        ),
      },
    },
    ...buildProviderReplayFamilyHooks({ family: "openai-compatible" }),
    ...buildProviderToolCompatFamilyHooks("openai"),
    wrapStreamFn(ctx) {
      if (ctx.provider !== "fortytwo" || !ctx.streamFn) return undefined;
      const underlying = ctx.streamFn;
      const wrapped = (model, context, options) =>
        underlying(model, context, {
          ...options,
          headers: fortytwoHeaders("stream", options?.headers),
        });
      return Object.assign(wrapped, { preservesGenericCompatibility: true });
    },
  },
});
export default plugin;
