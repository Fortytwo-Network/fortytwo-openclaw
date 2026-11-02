import { resolveOpenAIRequestReasoning } from "openclaw/plugin-sdk/llm";
import { describe, expect, it, vi } from "vitest";
import plugin from "../src/index.js";
import { applyConfig } from "../src/onboard.js";
import { fortytwoHeaders } from "../src/headers.js";
import manifest from "../openclaw.plugin.json" with { type: "json" };
function registered() {
  let provider;
  plugin.register({ registerProvider(p) { provider = p; }, registerModelCatalogProvider() {} });
  return provider;
}
describe("Fortytwo provider", () => {
  it("registers API-key auth and a network-free catalogue", async () => {
    const p = registered();
    expect(p.id).toBe("fortytwo");
    expect(p.auth.some(a => a.id === "api-key")).toBe(true);
    const rows = await p.staticCatalog.run({ config: {}, env: {} });
    expect(rows.provider.models[0]).toMatchObject({ id: "qwen/qwen3.8-27b", contextWindow: 262144 });
    expect(manifest.modelCatalog.discovery.fortytwo).toBe("refreshable");
  });
  it("onboards a connection without copying catalogue rows or replacing an existing default", () => {
    const cfg = applyConfig({ agents: { defaults: { model: { primary: "other/model" } } } });
    expect(cfg.models.providers.fortytwo.models).toEqual([]);
    expect(cfg.agents.defaults.model.primary).toBe("other/model");
    expect(applyConfig({}).agents.defaults.model.primary).toBe("fortytwo/qwen/qwen3.8-27b");
  });
  it("applies attribution on inference and keeps credentials and cancellation", () => {
    const p = registered(); const stream = vi.fn(() => "stream");
    const signal = new AbortController().signal;
    const wrap = p.wrapStreamFn({ provider: "fortytwo", streamFn: stream });
    expect(wrap.preservesGenericCompatibility).toBe(true);
    expect(wrap({}, {}, { headers: { Authorization: "Bearer synthetic", "X-Title": "override" }, signal })).toBe("stream");
    const options = stream.mock.calls[0][2];
    expect(options.signal).toBe(signal);
    expect(new Headers(options.headers).get("authorization")).toBe("Bearer synthetic");
    expect(new Headers(options.headers).get("x-title")).toBe("OpenClaw");
    expect(new Headers(fortytwoHeaders("http")).get("x-title")).toBe("OpenClaw");
    expect(p.wrapStreamFn({ provider: "other", streamFn: stream })).toBeUndefined();
  });
  it("offers only the qualified reasoning ladder", () => {
    const compat = manifest.modelCatalog.providers.fortytwo.models[0].compat;
    expect(compat.thinkingLevels).toEqual(["off", "low", "medium", "xhigh"]);
    expect(compat.reasoningEffortMap.off).toBe("none");
  });
});

const seed = manifest.modelCatalog.providers.fortytwo;
it.each([["off", "none"], ["low", "low"], ["medium", "medium"], ["xhigh", "xhigh"]])("SDK maps %s to wire effort %s", (level, expected) => {
  expect(resolveOpenAIRequestReasoning({ ...seed.models[0], provider: "fortytwo", api: seed.api, baseUrl: seed.baseUrl }, level).effort).toBe(expected);
});
