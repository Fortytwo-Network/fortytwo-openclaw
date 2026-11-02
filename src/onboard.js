import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
import manifest from "../openclaw.plugin.json" with { type: "json" };

export const DEFAULT_MODEL = "fortytwo/qwen/qwen3.8-27b";
export const { applyConfig } = createProviderConnectionPresetAppliers({
  primaryModelRef: DEFAULT_MODEL,
  resolveParams: () => ({
    providerId: "fortytwo",
    api: "openai-completions",
    baseUrl: manifest.modelCatalog.providers.fortytwo.baseUrl,
    catalogModels: () => manifest.modelCatalog.providers.fortytwo.models.map((model) => ({
      ...model,
      input: ["text", "image"],
      compat: { ...model.compat, maxTokensField: "max_tokens" },
    })),
  }),
});
